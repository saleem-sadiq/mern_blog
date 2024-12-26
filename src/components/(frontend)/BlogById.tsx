/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  _id: string;
  title: string;
  date: string;
  admin: string;
  content: string;
}

interface MostVisitedBlog {
  _id: number;
  name: string;
  content: string;
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


export default function BlogById({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost>();
  const [relBlogPosts, setRelBlogPosts] = useState<MostVisitedBlog[]>([]);
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

  useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/blog/get"); // Adjust the API endpoint accordingly
          if (!response.ok) {
            throw new Error("Failed to fetch blogs");
          }
          const data = await response.json();
          setRelBlogPosts(data)
          return data

        } catch (error: any) {
          return { error: error.message };
        }
        setIsLoading(false);
      };
  
      fetchData();
    }, []);

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
          <div className="border border-blackfade2 p-4 rounded-xl lg:col-span-2">
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
                    : relBlogPosts.map((blog, index) => (
                        <React.Fragment key={blog._id}>
                          <MostVisitedBlogCard blog={blog} />
                          {index < relBlogPosts.length - 1 && (
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

export function BlogPostContent({ post }: { post: BlogPost | undefined }) {
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
      <h3 className="font-semibold">{blog.name}</h3>
      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="max-w-none text-sm text-gray-400"
      />
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-xs">{blog.date}</span>
        </div>
        <Link
        href={`/blogs/${blog._id}`}
          className="text-red-500 hover:text-red-400 p-0 h-auto"
        >
          Read More
        </Link>
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
