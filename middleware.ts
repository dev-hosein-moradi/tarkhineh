import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const protectedRoutes = ['/track-orders', '/profile', '/settings'];

const isTokenExpired = (token: string | undefined): boolean => {
    if (!token) return true;
    try {
        const decoded: any = jwt.decode(token);
        // Convert exp (in seconds) to milliseconds
        if (decoded?.exp && Date.now() >= decoded.exp * 1000) {
            return true;
        }
        return false;
    } catch (err) {
        return true;
    }
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;

    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        if (!token) {
            console.log('No token. Redirecting to /login.');
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (isTokenExpired(token)) {
            console.log('Token expired. Redirecting to /login.');
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/track-orders',
        '/track-orders/:path*',
        '/profile',
        '/profile/:path*',
        '/settings',
        '/settings/:path*',
    ],
};