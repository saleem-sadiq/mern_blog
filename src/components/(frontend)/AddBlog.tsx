"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Editor from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

// Define validation schema with image file validation and status checkbox
const blogSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters long." }),
  status: z.boolean().default(false), // Add status field
});

type BlogFormValues = z.infer<typeof blogSchema>;

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

export default function AddBlog() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  // Initialize the form with default values
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      name: "",
      content: "",
      status: false, // Set default for status
    },
  });

  // Submit handler
  async function handleSubmit(values: BlogFormValues) {
    setPending(true);

    try {
      // Convert form data to send to the backend, including the file
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("content", values.content);
      formData.append("status", values.status ? "1" : "0"); // Add status field

      // Make the POST request to your Next.js API route
      const response = await fetch("/api/blog/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog.");
      }

      // Handle success response
      toast.success("Blog created successfully!");
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred while creating the blog."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="bg-whitefade pt-28 flex max-w-full min-h-screen flex-col px-10 py-4 gap-4">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Blog title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Field (Editor) */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <Editor initialValue={defaultValue} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Blog"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
