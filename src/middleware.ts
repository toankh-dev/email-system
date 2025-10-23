import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// constants
import { ROUTES } from './constants/routes';
import { addSecurityHeaders } from './middleware.security';

export function middleware(request: NextRequest) {
  const prevPath = request.cookies.get('prevPath')?.value ?? ROUTES.PORTAL;
  const token = request.cookies.get('token')?.value;

  if (!token && request.nextUrl.pathname !== ROUTES.LOGIN) {
    // If token is missing, redirect to login page
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && request.nextUrl.pathname === ROUTES.LOGIN) {
    const prevPathUrl = new URL(prevPath, request.url);
    return NextResponse.redirect(prevPathUrl);
  }

  if (token && request.nextUrl.pathname === ROUTES.HOME) {
    const prevPathUrl = new URL(prevPath, request.url);
    return NextResponse.redirect(prevPathUrl);
  }
  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)F
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
