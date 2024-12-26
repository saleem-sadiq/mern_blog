import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Extract form data from the request
    const formData = await request.formData();
    const name = formData.get("name");
    const content = formData.get("content");

    // Prepare the JSON data for the backend
    const backendData = {
      title: name,
      content: content,
      date: new Date().toISOString().split("T")[0],
    };

    const backendDomain = process.env.BACKEND_DOMAIN;
    const response = await fetch(`${backendDomain}/blogs/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",  // Specify JSON content
      },
      body: JSON.stringify(backendData),  // Send the data as JSON
    });

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
