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
import { useState } from "react";
import PasswordToggle from "./PasswordToggle";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Schema for form validation using Zod
const signUpSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().regex(/^\+?[1-9]\d{0,14}(?:[\s-]\d+)*$/, {
      message: "Please enter a valid phone number. e.g.(+92 311 123 4567)",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true); // Start loading
    try {
      const formData = new FormData();

      // Append each form value to the FormData object
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const response = await fetch("/api/customer/auth/signup", {
        method: "POST",
        body: formData, // Automatically sets the correct headers for multipart/form-data
      });

      const data = await response.json(); // Parse the response JSON

      // Check for errors based on the status code or response content
      if (response.status >= 400 || data.status === "error") {
        toast.error(data.message || "Failed to sign up");
        return;
      } else {
        // Handle success
        toast.success("Sign up form submitted", {
          description: data.message || "Success!",
        });
        form.reset();
        router.push("/signin")
      }
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <div className="mt-5 p-4 xl:max-w-xl max-w-6xl mx-auto">
      <div className=" flex justify-between items-center text-13">
        <Link href={"signin"}>
          <ArrowLeft className="rounded-full bg-default text-whitefade w-10 h-10 p-2" />
        </Link>
        <p>
          {`Already a memeber? `}
          <span className="text-default">
            <Link href={"signin"}>Sign In</Link>
          </span>
        </p>
      </div>
      <div className="pb-4 xl:pb-0 mt-5">
        <h3 className="text-22 xl:text-24 font-semibold">Sign Up</h3>
        <p className="text-11 xl:text-13 text-gray-400 font-medium">
          Create your account by filling the form below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className="p-6 xl:p-5 bg-transparent text-white text-18 font-medium border-gray-300 border-2 focus:!border-default !ring-transparent focus:!ring-offset-0 focus:!outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    className="p-6 xl:p-5 bg-transparent text-white text-18 font-medium border-gray-300 border-2 focus:!border-default !ring-transparent focus:!ring-offset-0 focus:!outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone"
                    {...field}
                    className="p-6 xl:p-5 bg-transparent text-white text-18 font-medium border-gray-300 border-2 focus:!border-default !ring-transparent focus:!ring-offset-0 focus:!outline-none"
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
                      className="p-6 xl:p-5 bg-transparent text-white text-18 font-medium border-gray-300 border-2 focus:!border-default !ring-transparent focus:!ring-offset-0 focus:!outline-none"
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...field}
                      className="p-6 xl:p-5 bg-transparent text-white text-18 font-medium border-gray-300 border-2 focus:!border-default !ring-transparent focus:!ring-offset-0 focus:!outline-none"
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
          <Button
            type="submit"
            variant={"none"}
            className="bg-transparent hover:bg-transparent mx-auto mx-w-xl w-full"
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
                {isLoading ? <Loader /> : "Sign Up"}
              </div>
            </div>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
