
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const backendDomain = process.env.BACKEND_DOMAIN;

    // Extract token from headers or cookies (if available)
    let token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      token = (await cookies()).get("token")?.value;
    }

    // Extract role from cookies
    const role = (await cookies()).get("role")?.value;

    if (!token || !role) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: No token or role found." },
        { status: 401 }
      );
    }

    // Fetch the blog by ID from the backend
    const response = await fetchWithAuth(
      `${backendDomain}/admin/blog/get_blog_by_id.php?id=${id}`,
      {
        method: "GET",
        cache: "no-cache",
      },
      token
    );

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

    // Prepend BACKEND_DOMAIN to the image_url of the blog (if it exists)
    const updatedBlog = {
      ...blog,
      image_url: blog.image_url
        ? `${backendDomain}/admin/blog/blog_thumbnail/${blog.image_url}`
        : null,
    };

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
