import { cookies as nextCookies } from 'next/headers'; // For accessing cookies server-side

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  token?: string
) {
  let role: string | undefined;

  if (typeof document !== "undefined") {
    // Client-side: get token and role from document.cookie
    if (!token) {
      token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    }

    role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
  } else {
    // Server-side: get token and role from Next.js cookies
    const cookies = await nextCookies();
    if (!token) {
      token = cookies.get('token')?.value;
    }
    role = cookies.get('role')?.value;
  }

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      Cookie: `role=${role || ''}`, // Include role in the Cookie header
    };
  } else {
    console.warn("No token found in cookies or provided as a parameter.");
  }

  const response = await fetch(url, options);
  return response;
}
