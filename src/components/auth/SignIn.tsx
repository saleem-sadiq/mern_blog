/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import PasswordToggle from "./PasswordToggle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader } from "lucide-react";

// Schema for form validation using Zod
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

interface SignInProps {
  onSignInSuccess?: () => void;
}

const SignIn: FC<SignInProps> = () => {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true); // Start loading
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        body: formData, // Automatically sets the correct headers for multipart/form-data
      });

      const data = await response.json();

      // Handle the response based on the status in the data
      if (response.status >= 400 || data.error) {
        toast.error(data.error || "Sign in failed");
        return;
      }

      // If it's a success, show the success toast
      toast.success("Login successful", { description: data.message });
      // Redirect to dashboard
      router.push('/')
      // Sign-in successful
      // onSignInSuccess && onSignInSuccess(); // Call the callback if provided
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <div className="p-4 xl:max-w-xl max-w-6xl mx-auto">
      <Link href={"/"} className="flex gap-4 items-center my-6">
          <ArrowLeft className="rounded-full bg-default text-whitefade w-10 h-10 p-2" />
          <span className="font-semibold">Home</span>
        </Link>
      <div className="pb-4 xl:pb-0">
        <h3 className="text-22 xl:text-24 font-semibold">Sign In</h3>
        <p className="text-11 xl:text-13 text-gray-400 font-medium">
          Welcome, Please enter your details
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 xl:space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...field}
                    className="p-2 xl:p-5 bg-transparent text-white text-18 font-medium border-gray-300 border-2 focus:!border-default !ring-transparent focus:!ring-offset-0 focus:!outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                      className="p-2 xl:p-5 bg-transparent text-white text-18 font-medium border-gray-300 border-2 focus:!border-default !ring-transparent focus:!ring-offset-0 focus:!outline-none"
                    />
                    <PasswordToggle
                      className="absolute z-10 right-3 top-3"
                      value={showPass}
                      onClick={() => setShowPass(!showPass)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Link
            href={"forgotpassword"}
            className="text-11 py-10 text-center text-default font-semibold"
          >
            Forgot Password?
          </Link>
          <Button
            type="submit"
            variant={"none"}
            className="bg-transparent hover:bg-transparent mx-auto w-full max-w-[230px] block"
            disabled={isLoading}
          >
            <div
              className={cn(
                "w-full xl:w-[230px] group jellyEffect overflow-hidden 3xl:flex justify-center items-center gap-4 text-[16px] font-semibold text-whitefade border-2 bordder-white px-6 py-3 bg-default ease-in rounded-full relative"
              )}
            >
              <div className="absolute -left-[100%] top-0 w-full h-12 rounded-full opacity-35 bg-blue-300 group-hover:translate-x-[100%]  transition-transform group-hover:duration-1000 duration-500"></div>
              <div className="absolute -left-[100%] top-0 w-full h-12 rounded-full opacity-25 bg-blue-400 group-hover:translate-x-[100%]  transition-transform group-hover:duration-700 duration-700"></div>
              <div className="absolute -left-[100%] top-0 w-full h-12 rounded-full opacity-15 bg-blue-500 group-hover:translate-x-[100%]  transition-transform group-hover:duration-500 duration-1000"></div>
              <div className="relative z-10 flex items-center justify-center gap-4">
                {isLoading ? <Loader /> : "Sign In"}
              </div>
            </div>
          </Button>
        </form>
      </Form>
      <div className="text-11 py-10 text-center text-gray-400 font-semibold">
        <p>
          {`Don't have an account?`}{" "}
          <span className="text-default">
            <Link href={"signup"}>Sign Up</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
