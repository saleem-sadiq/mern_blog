import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Extract token from headers or cookies (if available)
    let token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      // Use Next.js cookies API to get the token from HttpOnly cookies
      token = cookies().get("token")?.value;
    }

    // Extract role from cookies
    const role = cookies().get("role")?.value;

    if (!token || !role) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: No token or role found." },
        { status: 401 }
      );
    }

    const { id } = params;
    const backendDomain = process.env.BACKEND_DOMAIN;

    // Create FormData to send the blog ID for deletion
    const formData = new FormData();
    formData.append("id", id);

    const response = await fetchWithAuth(
      `${backendDomain}/admin/blog/delete_blog.php`,  // Adjust this URL to match your blog delete API
      {
        method: "POST",
        body: formData,
      },
      token
    );

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      return NextResponse.json(
        { error: data.message || "Failed to delete blog" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
