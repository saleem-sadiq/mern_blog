/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendDomain = process.env.BACKEND_DOMAIN;

    // Fetch all blogs from the backend
    const response = await fetch(`${backendDomain}/blogs`, {
      cache: "no-cache",
    });

    // Attempt to parse the JSON response
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
      return NextResponse.json(
        {
          error: "Failed to parse JSON from server",
          details: String(jsonError),
        },
        { status: 500 }
      );
    }

    // Check if the response was not successful
    if (!response.ok) {
      console.error("Server responded with an error:", data);
      return NextResponse.json(
        {
          error: `Failed to fetch blogs. Server responded with status ${response.status}`,
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
