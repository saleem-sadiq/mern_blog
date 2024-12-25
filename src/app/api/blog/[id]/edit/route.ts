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
    const formData = await request.formData();

    // Extract form data values
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const content = formData.get("content");
    const status = formData.get("status");
    const image = formData.get("image");
    if (!name || !slug || !description || !content) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Prepare the form data for the backend
    const backendFormData = new FormData();
    backendFormData.append("id", id);
    backendFormData.append("name", name);
    backendFormData.append("slug", slug);
    backendFormData.append("description", description);
    backendFormData.append("content", content); // Store as HTMLContent
    backendFormData.append("status", status == "1" ? "1" : "0");

    if (image instanceof File) {
      backendFormData.append("image", image, image.name);
    }

    const backendDomain = process.env.BACKEND_DOMAIN;
    const response = await fetchWithAuth(
      `${backendDomain}/admin/blog/edit_blog.php`,
      {
        method: "POST",
        body: backendFormData,
      },
      token
    );

    const contentType = response.headers.get("content-type");

    // Handle JSON response
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (!response.ok || data.status === "error") {
        return NextResponse.json(
          { error: data.message || "Failed to update blog." },
          { status: 500 }
        );
      }

      return NextResponse.json(data, { status: 200 });
    } else {
      // If the response is not JSON, handle it as an error
      const text = await response.text();
      console.error("Unexpected response from PHP backend:", text);
      return NextResponse.json(
        { error: "Unexpected response from backend." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
