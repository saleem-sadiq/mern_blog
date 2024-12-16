import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Extract cookies from the request headers
  const cookies = request.headers.get('cookie') || '';
  const customerIdCookie = cookies.split('; ').find(cookie => cookie.startsWith('customer_id='))?.split('=')[1];

  if (!customerIdCookie) {
    return NextResponse.json({ status: 'error', message: 'No customer ID found in cookies' });
  }

  // Fetch customer info from the database using the customer_id from the cookies
  try {
    const response = await fetch(`${process.env.BACKEND_DOMAIN}/customer/auth/get_customer_info.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customer_id: customerIdCookie }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return NextResponse.json({ status: 'success', name: data.name, email: data.email, phone: data.phone });
    } else {
      return NextResponse.json({ status: 'error', message: data.message });
    }
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Error fetching customer info' });
  }
}
