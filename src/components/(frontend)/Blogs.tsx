/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ActionProp, addButton, Blog, columns } from "./Columns"; // Updated from Assignment to Blog
import ViewData from "./(tableView)/ViewData";

// Fetches data for blogs
async function getData(): Promise<Blog[] | { error: string }> {
  try {
    const response = await fetch("/api/blog/get"); // Adjust the API endpoint accordingly
    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.details?.message || "Failed to fetch blogs" };
    }

    const data = await response.json();

    // If the response contains no data, return an empty array
    if (!Array.isArray(data) || data.length === 0) {
      return []; // Return an empty array if no blogs are found
    }

    return data;
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred" };
  }
}

const Blogs = () => {
  const [data, setData] = useState<Blog[]>([]); // Updated from Assignment to Blog
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getData();
      if ("error" in result) {
        console.log(result.error);
      } else {
        setData(result); // Set the blogs data
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 px-5">
        <p className="text-36 font-semibold text-default">Blogs</p>{" "}
        {/* Updated from Assignments to Blogs */}
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mt-24 px-5">
      <p className="text-36 font-semibold text-default">Blogs</p>{" "}
      {/* Updated */}
      <ViewData
        columns={columns}
        data={data}
        addButton={addButton}
        actionComponent={ActionProp}
        basePath="/blogs/" // Updated from "/admin/assignment/" to "/admin/blog/"
      />
    </div>
  );
};

export default Blogs;
