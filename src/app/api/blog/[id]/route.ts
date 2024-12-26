import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const backendDomain = process.env.BACKEND_DOMAIN;

    // Fetch the blog by ID from the backend
    const response = await fetch(`${backendDomain}/blogs/${id}`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch blog" },
        { status: 500 }
      );
    }

    const blog = await response.json();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    // Map the 'title' key to 'name' in the blog object
    const transformedBlog = {
      ...blog,
      name: blog.title, // Add 'name' key
    };

    return NextResponse.json(transformedBlog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
