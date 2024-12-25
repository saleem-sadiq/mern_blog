/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ActionProp, addButton, Blog, columns } from "./Columns"; // Updated from Assignment to Blog
import ViewData from "./(tableView)/ViewData";

// Fetches data for blogs
async function getData(): Promise<Blog[] | { error: string }> {
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

const Blogs = () => {
  const [data, setData] = useState<Blog[]>([]); // Updated from Assignment to Blog
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getData();
      if ("error" in result) {
        setError(result.error);
      } else {
        setData(result);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Blogs</p> {/* Updated from Assignments to Blogs */}
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 px-5">
        <p className="text-36 font-semibold text-default">Blogs</p> {/* Updated */}
        <div className="text-center text-red-500">Error: {error}</div>
        <div className="text-center mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 px-5">
      <p className="text-36 font-semibold text-default">Blogs</p> {/* Updated */}
      <ViewData
        columns={columns}
        data={data}
        addButton={addButton}
        actionComponent={ActionProp}
        basePath="/admin/blog/" // Updated from "/admin/assignment/" to "/admin/blog/"
      />
    </div>
  );
};

export default Blogs;
