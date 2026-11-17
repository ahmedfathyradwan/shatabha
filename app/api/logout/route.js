import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'تم تسجيل الخروج بنجاح' },
    { status: 200 }
  );

  // حذف الـ cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // حذف فوري
    path: '/',
  });

  return response;
}
