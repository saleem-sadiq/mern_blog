/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { convertHTMLToEditorValue } from "@/utils/convertHTMLToEditorValue";
import { convertProseMirrorToHTML } from "@/utils/covertJSONtoHTML";

// Define validation schema with image file validation and status checkbox
const blogSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  content: z.any(), // Content in JSON format
});

type BlogFormValues = z.infer<typeof blogSchema>;

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "This is dummy text" }, // Default paragraph content
      ],
    },
  ],
};

export default function EditBlog({ blogId }: { blogId: string }) {
  const [pending, setPending] = useState(false);
  const [editorContent, setEditorContent] = useState<any>(null); // For the editor's initial value
  const router = useRouter();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      name: "",
      content: defaultValue, // Pass the default structure for the content
    },
  });

  // Fetch the blog data by ID on component mount
  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blog/${blogId}`);
        if (!response.ok) throw new Error("Failed to fetch blog data");

        const blogData = await response.json();

        // Convert HTML content to ProseMirror-like JSON
        const convertedContent = convertHTMLToEditorValue(blogData.content);
        form.reset({
          name: blogData.name,
          content: convertedContent,
        });
        setEditorContent(convertedContent); // Set the converted content to the editor
      } catch (error) {
        toast.error("An error occurred while fetching the blog.");
      }
    }

    fetchBlog();
  }, [blogId, form]);

  async function handleSubmit(values: BlogFormValues) {
    setPending(true);

    // Check if the content in form is different from the initial editor content
    const isContentChanged =
      JSON.stringify(values.content) !== JSON.stringify(editorContent);

    // Determine which content to send - the updated JSON or the existing HTML content
    const contentToSend = isContentChanged
      ? values.content
      : convertProseMirrorToHTML(editorContent); // If unchanged, use HTMLContent

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("content", contentToSend); // Send either updated content or original HTML

      const response = await fetch(`/api/blog/${blogId}/edit`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update blog.");
      }

      toast.success("Blog updated successfully!");
      router.push("/blogs");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while updating the blog."
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-24 flex max-w-full flex-col px-10 py-4 gap-4">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
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
          {editorContent && ( // Only render the editor when content is ready
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <Editor
                    initialValue={editorContent}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={pending}>
            {pending ? "Updating..." : "Update Blog"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
