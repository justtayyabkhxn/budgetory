import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ msg: 'Logged out' });

  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}
