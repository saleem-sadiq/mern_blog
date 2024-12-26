import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const backendDomain = process.env.BACKEND_DOMAIN;

    // Create FormData to send the blog ID for deletion
    const formData = new FormData();
    formData.append("id", id);
    console.log(id)
    const response = await fetch(
      `${backendDomain}/blogs/${id}`,  // Adjust this URL to match your blog delete API
      {
        method: "DELETE",
      }
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
