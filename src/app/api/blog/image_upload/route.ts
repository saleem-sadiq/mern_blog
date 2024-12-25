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

    // Check for authorization token
    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: No token found." },
        { status: 401 }
      );
    }

    // Get the form data (expecting an image file)
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    // Ensure that an image file is uploaded
    if (!imageFile) {
      return NextResponse.json(
        { status: "error", message: "No image file provided." },
        { status: 400 }
      );
    }

    // Create a FormData object to send to the PHP backend
    const backendFormData = new FormData();
    backendFormData.append("image", imageFile, imageFile.name);

    // Send the request to the PHP backend for image processing
    const response = await fetchWithAuth(
      `${process.env.BACKEND_DOMAIN}/admin/blog/image_upload.php`,  // Your PHP backend endpoint
      {
        method: "POST",
        body: backendFormData,
      },
      token // Pass the token explicitly
    );

    // Process the response from the PHP backend
    const result = await response.json();

    if (!response.ok || result.status === "error") {
      return NextResponse.json(
        { status: "error", message: result.message || "Image upload failed." },
        { status: 500 }
      );
    }

    // Return the uploaded image location to the client
    return NextResponse.json(
      {
        status: "success",
        message: "Image uploaded successfully.",
        url: result.url, // URL of the uploaded image
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { status: "error", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
