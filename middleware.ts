import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-firebase-auth-edge'; // Will install later if needed, but for simplicity use auth check

// Protected paths
const protectedPaths = ['/dashboard', '/customers', '/documents', '/settings'];

export function middleware(request: NextRequest) {
  const { token } = getToken(request, false); // Requires next-firebase-auth-edge setup, fallback to cookies/local for now

  // For now, check Firebase ID token in cookies
  const idToken = request.cookies.get('firebaseIdToken')?.value;

  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (!idToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else if (request.nextUrl.pathname === '/login') {
    if (idToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
