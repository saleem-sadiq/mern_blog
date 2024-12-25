import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const data: Record<string, string> = {};

    // Convert the formData into a JSON object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // Send the data as JSON to the PHP backend
    const response = await fetch(`${process.env.BACKEND_DOMAIN}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify(data), // Send the form data as JSON
    });

    const result = await response.json();

    // Check if the response indicates an error
    if (result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Successful sign-in
    const { token, name, id } = result;

    // Create a response object to set cookies
    const responseCookie = NextResponse.json(result, { status: 200 });

    // Define the maxAge for one week (in seconds)
    const maxAge = 60 * 60 * 24 * 7; // 7 days

    // Set the JWT token in an HttpOnly cookie
    responseCookie.cookies.set('token', token, {
      httpOnly: true, // Ensures the cookie is not accessible to JavaScript
      secure: true, // Only sent over HTTPS in production
      maxAge, // Expires in a week
      path: '/', // Available site-wide
    });

    // Set other details in separate cookies
    responseCookie.cookies.set('name', name, {
      httpOnly: false,
      secure: true,
      maxAge,
      path: '/',
    });

    responseCookie.cookies.set('id', id, {
      httpOnly: false,
      secure: true,
      maxAge,
      path: '/',
    });

    // Return the response with cookies
    return responseCookie;
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
