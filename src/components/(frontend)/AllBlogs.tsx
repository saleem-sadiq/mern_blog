/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Search, User } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  _id: number;
  title: string;
  content: string;
  date: string;
  admin: string;
}

// Fetches data for blogs
async function getData(): Promise<BlogPost[] | { error: string }> {
  try {
    const response = await fetch("/api/blog/get"); // Adjust the API endpoint accordingly
    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }
    return await response.json();
  } catch (error: any) {
    return { error: error.message };
  }
}
export default function AllBlogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getData();
      if ("error" in result) {
        setError(result.error);
      } else {
        setBlogPosts(result);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);
  console.log(error);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const filteredBlogPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-blackfade bg-white min-h-screen p-6 mt-24">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8">
          <h1 className="text-3xl font-bold">Blogs</h1>
          <div className="relative w-full lg:w-fit">
            <Input
              type="text"
              placeholder="Search"
              className="w-full lg:w-64 bg-blackfade2 border-gray-700 text-white pl-10 lg:pr-4 py-2 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-6 lg:pr-4">
                {isLoading ? (
                  Array(4)
                    .fill(0)
                    .map((_, index) => <BlogPostCardSkeleton key={index} />)
                ) : filteredBlogPosts.length > 0 ? (
                  filteredBlogPosts.map((post) => (
                    <BlogPostCard key={post._id} post={post} />
                  ))
                ) : (
                  <p>No blog found</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <div className="w-full bg-blackfade2 rounded-lg p-6 space-y-4">
      <h2 className="text-white text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-400">{post.content}</p>
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex items-center text-gray-500">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm">{post.admin}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{post.date}</span>
          </div>
        </div>
        <Button className="bg-default hover:bg-default text-white">
          <Link href={`blogs/${post._id}`} className="">
            Read more
          </Link>
        </Button>
      </div>
    </div>
  );
}

function BlogPostCardSkeleton() {
  return (
    <div className="w-full bg-blackfade2 rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-3/4 bg-gray-700" />
      <Skeleton className="h-4 w-full bg-gray-700" />
      <Skeleton className="h-4 w-full bg-gray-700" />
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div className="flex flex-col lg:flex-row gap-5">
          <Skeleton className="h-4 w-24 bg-gray-700" />
          <Skeleton className="h-4 w-32 bg-gray-700" />
        </div>
        <Skeleton className="h-10 w-28 bg-gray-700" />
      </div>
    </div>
  );
}
