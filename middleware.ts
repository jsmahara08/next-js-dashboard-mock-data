import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock function to check if user is authenticated
// In a real application, this would verify a JWT token
function isAuthenticated(request: NextRequest) {
  const authCookie = request.cookies.get('auth-token')?.value;
  return !!authCookie;
}

export function middleware(request: NextRequest) {
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If not authenticated and not trying to access the login page
    if (!isAuthenticated(request) && !request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    // If authenticated and trying to access the login page, redirect to dashboard
    if (isAuthenticated(request) && request.nextUrl.pathname.startsWith('/admin/login')) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};