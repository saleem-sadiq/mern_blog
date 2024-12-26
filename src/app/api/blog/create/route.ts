import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Extract role from cookies (if applicable)
    const userId = (await cookies()).get("id")?.value;

    // Unauthorized if no token or role is present
    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: No token or role found." },
        { status: 401 }
      );
    }

    // Parse the request's form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status");

    console.log("Received status:", status);

    // Step 1: Send JSON Data to PHP Backend
    const jsonPayload = {
      title :name,
      content,
      date: new Date().toISOString().split("T")[0],
      admin: userId, // Pass userId if needed
    };

    const jsonResponse = await fetch(
      `${process.env.BACKEND_DOMAIN}/blogs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonPayload),
      }
    );

    const jsonResult = await jsonResponse.json();

    if (!jsonResponse.ok || jsonResult.status === "error") {
      return NextResponse.json(
        { status: "error", message: jsonResult.message || "Failed to create blog." },
        { status: 500 }
      );
    }

  
    return NextResponse.json(
      { status: "success", message: "Blog created successfully" },
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
