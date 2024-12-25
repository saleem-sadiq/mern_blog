/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function POST(request: Request) {

      // Clear cookies on the client side
      const responseCookie = NextResponse.json({ message: 'Logout successful' });
      responseCookie.cookies.set('token', '', { maxAge: -1, path: '/' }); // Remove the token
      responseCookie.cookies.set('id', '', { maxAge: -1, path: '/' }); // Remove the role
      responseCookie.cookies.set('name', '', { maxAge: -1, path: '/' }); // Remove the role

      return responseCookie; // Send response with cleared cookies
    
}
