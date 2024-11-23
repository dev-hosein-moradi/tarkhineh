import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// List of protected routes
const protectedRoutes = ['/track-orders', '/profile', '/settings'];

// Function to decode and check token expiration
const isTokenExpired = (token: string | undefined): boolean => {
    console.log(token)
    if (!token) return true;
    try {
        const decoded: any = jwt.decode(token);
        console.log(decoded)
        // Check if the token is expired by comparing current time with the 'exp' claim
        if (decoded?.exp && Date.now() >= decoded.exp) {
            console.log(decoded)
            return true;
        }
        return false;
    } catch (err) {
        // If decoding fails, consider the token expired
        return true;
    }
};

export function middleware(request: NextRequest) {
    // Get the current user's authentication token from cookies
    console.log(request)
    const token = request.cookies.get('refreshToken')?.value;
    console.log("token => " + token);
    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        if (!token) {
            // Redirect to login if the user is not authenticated
            return NextResponse.redirect(new URL('/403', request.url));
        }

        if (isTokenExpired(token)) {
            // Redirect to login if the token is expired
            return NextResponse.redirect(new URL('/403', request.url));
        }
    }

    // Allow the request to proceed
    return NextResponse.next();
}

// Match all routes that need to be checked by middleware
export const config = {
    matcher: ['/track-orders/:path*', '/profile/:path*', '/settings/:path*'], // Use path matchers to apply middleware to specific routes
};
