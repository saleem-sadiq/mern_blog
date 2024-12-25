import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Extract token from headers or cookies (if available)
    let token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      token = cookies().get("token")?.value;
    }

    // Extract role from cookies (if applicable)
    const role = cookies().get("role")?.value;

    // Unauthorized if no token or role is present
    if (!token || !role) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: No token or role found." },
        { status: 401 }
      );
    }

    // Parse the request's form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const imageFile = formData.get("image") as File | null;
    const status = formData.get("status"); // Set status based on the checkbox value

    console.log("ye status he:", status);
    // Create a FormData object to send to the PHP backend
    const backendFormData = new FormData();
    backendFormData.append("name", name);
    backendFormData.append("slug", slug);
    backendFormData.append("description", description);
    backendFormData.append("content", content);
    backendFormData.append("status", String(status)); // Append status

    // Handle the image file if it's provided
    if (imageFile) {
      backendFormData.append("image", imageFile, imageFile.name);
    }

    // Send the request to the PHP API
    const response = await fetchWithAuth(
      `${process.env.BACKEND_DOMAIN}/admin/blog/create_blog.php`,  // PHP backend endpoint
      {
        method: "POST",
        body: backendFormData,  // Pass the form data to the PHP backend
      },
      token // Pass the token explicitly
    );

    const result = await response.json();

    // Handle the PHP backend's response
    if (!response.ok || result.status === "error") {
      return NextResponse.json(
        { status: "error", message: result.message || "Failed to create blog." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { status: "success", message: result.message || "Blog created successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { status: "error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
