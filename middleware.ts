// Middleware to protect admin routes with Basic Auth
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authResponse = requireAuth(request);
    if (authResponse) {
      return authResponse; // Return 401 challenge if auth failed
    }
  }

  // Continue to the page if auth passed or not an admin route
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};
