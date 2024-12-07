import { NextResponse } from 'next/server';

export function middleware(req: {
  nextUrl: { pathname: any };
  url: string | URL | undefined;
}) {
  const { pathname } = req.nextUrl;

  // Check if the requested path is `/`
  if (pathname === '/') {
    const redirectUrl = new URL('/dashboard/employee', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next(); // Proceed with the request as usual
}

// Apply the middleware to all routes
export const config = { matcher: ['/'] };
