/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, any> = {};

    // Convert formData to JSON format
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Send JSON data to the PHP backend
    const response = await fetch(`${process.env.BACKEND_DOMAIN}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to sign up', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
