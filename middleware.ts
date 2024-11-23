import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const protectedRoutes = ['/track-orders', '/profile', '/settings'];

const isTokenExpired = (token: string | undefined): boolean => {
    if (!token) return true;
    try {
        const decoded: any = jwt.decode(token);
        if (decoded?.exp && Date.now() >= decoded.exp) {
            return true;
        }
        return false;
    } catch (err) {
        return true;
    }
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get('authToken')?.value;
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/403', request.url));
        }

        if (isTokenExpired(token)) {
            return NextResponse.redirect(new URL('/403', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/track-orders/:path*', '/profile/:path*', '/settings/:path*'], // Use path matchers to apply middleware to specific routes
};
