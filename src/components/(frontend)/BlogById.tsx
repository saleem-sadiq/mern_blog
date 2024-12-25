/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, User } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  date: string;
  admin: string;
  content: string;
}

interface MostVisitedBlog {
  id: number;
  title: string;
  excerpt: string;
  date: string;
}

// Fetches data for blogs
async function getData(id: string): Promise<BlogPost | { error: string }> {
  try {
    const response = await fetch(`/api/blog/getById/${id}`); // Adjust the API endpoint accordingly
    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }
    return await response.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

const mostVisitedBlogs: MostVisitedBlog[] = [
  {
    id: 1,
    title: "Cillum culpa in reprehenderit aliquip labore",
    excerpt:
      "Cillum culpa in reprehenderit aliquip labore eiusmod elit aliquip repre henderit occaecat tempo...",
    date: "04 March, 2022",
  },
  {
    id: 2,
    title: "Cillum culpa in reprehenderit aliquip labore",
    excerpt:
      "Cillum culpa in reprehenderit aliquip labore eiusmod elit aliquip repre henderit occaecat tempo...",
    date: "04 March, 2022",
  },
  {
    id: 3,
    title: "Cillum culpa in reprehenderit aliquip labore",
    excerpt:
      "Cillum culpa in reprehenderit aliquip labore eiusmod elit aliquip repre henderit occaecat tempo...",
    date: "04 March, 2022",
  },
];

export default function BlogById({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getData(id);
      if ("error" in result) {
        setError(result.error);
      } else {
        // Directly set blogPosts as it's not an array
        setBlogPosts(result);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  console.log(error);

  return (
    <div className="bg-white w-full text-white min-h-screen p-6 mt-24">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="w-full bg-blackfade2 rounded-lg border-l-4 border-default p-3 my-5">
            <h1 className="text-3xl font-bold mb-4">{blogPosts?.title}</h1>
            <div className="flex flex-wrap gap-5 items-center text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-2 mr-4">
                <User className="w-8 h-8 mr-1 bg-default rounded-full text-whitefade p-1" />
                <div className="flex flex-col">
                  <span>Posted By:</span>
                  {blogPosts?.admin}
                </div>
              </span>
              <span className="flex items-center gap-2 mr-4">
                <Calendar className="w-8 h-8 mr-1 bg-default rounded-full text-whitefade p-1" />
                <div className="flex flex-col">
                  <span>Posted On:</span>
                  {blogPosts?.date}
                </div>
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-8 h-8 mr-1 bg-default rounded-full text-whitefade p-1" />
                <div className="flex flex-col">
                  <span>Read Time:</span>4 min ago
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-blackfade2 text-white p-4 rounded-xl lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-120px)]">
              {isLoading ? (
                <BlogPostSkeleton />
              ) : (
                <BlogPostContent post={blogPosts} />
              )}
            </ScrollArea>
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-blackfade2 rounded-lg p-6 h-[calc(100vh-120px)] flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Most Visited Blogs</h2>
              <ScrollArea className="flex-grow">
                <div className="space-y-6">
                  {isLoading
                    ? Array(3)
                        .fill(0)
                        .map((_, index) => (
                          <React.Fragment key={index}>
                            <MostVisitedBlogCardSkeleton />
                            {index < 2 && (
                              <hr className="border-gray-700 my-6" />
                            )}
                          </React.Fragment>
                        ))
                    : mostVisitedBlogs.map((blog, index) => (
                        <React.Fragment key={blog.id}>
                          <MostVisitedBlogCard blog={blog} />
                          {index < mostVisitedBlogs.length - 1 && (
                            <hr className="border-gray-700 my-6" />
                          )}
                        </React.Fragment>
                      ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogPostContent({ post }: { post: BlogPost | undefined }) {
  console.log(post);
  // Check if post is undefined or null before rendering content
  if (!post) {
    return <div>Loading...</div>; // Optionally display a loading message or skeleton
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: post.content }}
      className="prose max-w-none"
    />
  );
}

function MostVisitedBlogCard({ blog }: { blog: MostVisitedBlog }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{blog.title}</h3>
      <p className="text-sm text-gray-400">{blog.excerpt}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-xs">{blog.date}</span>
        </div>
        <Button
          variant="link"
          className="text-red-500 hover:text-red-400 p-0 h-auto"
        >
          Read More
        </Button>
      </div>
    </div>
  );
}

function BlogPostSkeleton() {
  return (
    <div className="bg-blackfade2 rounded-lg overflow-hidden">
      <Skeleton className="w-full h-64 bg-gray-700" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4 bg-gray-700" />
        <Skeleton className="h-4 w-32 bg-gray-700" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-gray-700" />
          <Skeleton className="h-4 w-full bg-gray-700" />
          <Skeleton className="h-4 w-full bg-gray-700" />
          <Skeleton className="h-4 w-3/4 bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

function MostVisitedBlogCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4 bg-gray-700" />
      <Skeleton className="h-4 w-full bg-gray-700" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24 bg-gray-700" />
        <Skeleton className="h-4 w-20 bg-gray-700" />
      </div>
    </div>
  );
}
