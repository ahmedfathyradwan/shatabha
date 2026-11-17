import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'supersecret';

// الصفحات المحمية - تحتاج تسجيل دخول فقط
const protectedRoutes = [
  '/home',
  '/profile',
  '/donationPosts',
  '/offersPost',
  '/finishChoice',
  '/online',
  '/maintenance',
  '/provider',
];

// الصفحات الخاصة بالأدمن فقط
const adminOnlyRoutes = ['/dashboard'];

// صفحات Auth (مسموح بها لغير المسجلين فقط)
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgetpassword',
  '/auth/resetpassword',
  '/auth/verify',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value || null;

  let decoded = null;
  if (token) {
    try {
      decoded = jwt.verify(token, SECRET);
    } catch {
      decoded = null;
    }
  }

  const isValidToken = !!decoded;
  const userRole = decoded?.role || null;

  // ============ الصفحة الرئيسية / ============
  if (pathname === '/') {
    if (isValidToken) {
      return NextResponse.redirect(new URL('/home', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // ============ لو مسجل دخول وحاول يوصل لصفحة Auth ============
  if (pathname.startsWith('/auth') && isValidToken) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // ============ حماية Dashboard (أدمن فقط) ============
  const isDashboard = adminOnlyRoutes.some((route) => pathname.startsWith(route));
  if (isDashboard) {
    if (!isValidToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (userRole !== 'admin') {
      // لو مش أدمن → يروح الصفحة الرئيسية
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  // ============ حماية الصفحات العامة ============
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !isValidToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
