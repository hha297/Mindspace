import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
        // Check for session token in cookies
        const token =
                request.cookies.get('next-auth.session-token') ||
                request.cookies.get('__Secure-next-auth.session-token');

        // Check if user is trying to access protected routes
        if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/dashboard')) {
                if (!token) {
                        return NextResponse.redirect(new URL('/sign-in', request.url));
                }
        }

        // Check if authenticated user is trying to access sign-in or sign-up pages
        if (token && (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up')) {
                return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
}

export const config = {
        matcher: ['/admin/:path*', '/dashboard/:path*', '/sign-in', '/sign-up'],
};
