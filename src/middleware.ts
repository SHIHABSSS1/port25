import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Add any middleware logic here
  // For protected routes, you would check authentication tokens
  // As a simple example, any path starting with /admin would be protected
  // In a real implementation, you would check authentication tokens from cookies
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // In a real implementation, check if user is authenticated
    // For now, we'll just forward all requests as client-side auth is handled by the app
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 