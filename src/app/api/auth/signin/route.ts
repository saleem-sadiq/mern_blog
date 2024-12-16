import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const response = await fetch(`${process.env.BACKEND_DOMAIN}/customer/auth/signin.php`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

     // Check if the response indicates an error based on the status in the JSON
     if (result.status === 'error') {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Successful sign-in
    const { token, role, name, customer_id, customer_status } = result;

    // Create a response object to set cookies
    const responseCookie = NextResponse.json(result, { status: 200 });

    // Define the maxAge for one week (in seconds)
    const maxAge = 60 * 60 * 24 * 7; // 7 days

    // Set the JWT token in an HttpOnly cookie
    responseCookie.cookies.set('token', token, {
      httpOnly: false, // Makes the cookie inaccessible to JavaScript in the browser
      secure: true, // Ensures the cookie is sent only over HTTPS
      maxAge, // Expires in a week
      path: '/', // Cookie is available site-wide
    });

    // Set the role in a separate cookie
    responseCookie.cookies.set('role', role, {
      httpOnly: false, // Allows JavaScript to access this cookie if necessary
      secure: true, // Ensures the cookie is sent only over HTTPS
      maxAge, // Expires in a week
      path: '/', // Cookie is available site-wide
    });

    // Set the name in a separate cookie
    responseCookie.cookies.set('name', name, {
      httpOnly: false, // Allows JavaScript to access this cookie if necessary
      secure: true, // Ensures the cookie is sent only over HTTPS
      maxAge, // Expires in a week
      path: '/', // Cookie is available site-wide
    });

    // Set the status in a separate cookie
    responseCookie.cookies.set('customer_status', customer_status, {
      httpOnly: false, // Allows JavaScript to access this cookie if necessary
      secure: true, // Ensures the cookie is sent only over HTTPS
      maxAge, // Expires in a week
      path: '/', // Cookie is available site-wide
    });

    // Set the id in a separate cookie
    responseCookie.cookies.set('customer_id', customer_id, {
      httpOnly: false, // Allows JavaScript to access this cookie if necessary
      secure: true, // Ensures the cookie is sent only over HTTPS
      maxAge, // Expires in a week
      path: '/', // Cookie is available site-wide
    });

    return responseCookie;
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
