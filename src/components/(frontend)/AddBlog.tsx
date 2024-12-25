"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

// Define validation schema with image file validation and status checkbox
const blogSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." }),
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters long." }),
  image: z
    .any()
    .refine((file) => file instanceof File, { message: "Image is required." })
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
          file?.type
        ),
      { message: "Only .png, .jpg, .jpeg, and .webp formats are supported." }
    )
    .refine((file) => file?.size <= 4 * 1024 * 1024, {
      message: "Image size must be less than 4MB.",
    }),
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
      slug: "",
      description: "",
      content: "",
      image: undefined,
      status: false, // Set default for status
    },
  });

  // Automatically update the slug when the title changes
  useEffect(() => {
    const name = form
      .watch("name")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    form.setValue("slug", name);
  }, [form]);

  // Submit handler
  async function handleSubmit(values: BlogFormValues) {
    setPending(true);

    try {
      // Convert form data to send to the backend, including the file
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("description", values.description);
      formData.append("content", values.content);
      formData.append("image", values.image);
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
      router.push("/blog");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred while creating the blog."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="bg-[#fff8eb] pt-28 flex max-w-full flex-col px-10 py-4 gap-4">
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

          {/* Slug Field */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write a brief description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image File Upload */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                  />
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

          {/* Status Field (Checkbox) */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange as (value: boolean) => void}
                  />
                </FormControl>
                <FormLabel>Status (Published)</FormLabel>
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
