/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const logoutUrl = `${process.env.BACKEND_DOMAIN}/customer/auth/logout.php`; // PHP logout API

  try {
    // Call the PHP logout API
    const response = await fetch(logoutUrl, {
      method: 'POST',
      credentials: 'include', // Include cookies
    });

    const data = await response.json();

    if (data.status === 'success') {
      // Clear cookies on the client side
      const responseCookie = NextResponse.json({ message: 'Logout successful' });
      responseCookie.cookies.set('token', '', { maxAge: -1, path: '/' }); // Remove the token
      responseCookie.cookies.set('role', '', { maxAge: -1, path: '/' }); // Remove the role
      responseCookie.cookies.set('customer_id', '', { maxAge: -1, path: '/' }); // Remove the role
      responseCookie.cookies.set('name', '', { maxAge: -1, path: '/' }); // Remove the role
      responseCookie.cookies.set('customer_status', '', { maxAge: -1, path: '/' }); // Remove the customer status


      return responseCookie; // Send response with cleared cookies
    } else {
      return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
