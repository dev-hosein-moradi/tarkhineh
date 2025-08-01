import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security Configuration
const SECURITY_CONFIG = {
    // Content Security Policy - Updated for Cloudinary
    CSP_HEADER: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://upload-widget.cloudinary.com https://widget.cloudinary.com https://cloudinary.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://upload-widget.cloudinary.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob: https://res.cloudinary.com https://cloudinary.com;
    media-src 'self' https: https://res.cloudinary.com;
    connect-src 'self' ${process.env.NEXT_PUBLIC_SERVER_URL} https://vercel.live wss://ws-us3.pusher.com https://api.cloudinary.com https://upload-widget.cloudinary.com https://widget.cloudinary.com https://res.cloudinary.com;
    frame-src 'self' https://upload-widget.cloudinary.com https://widget.cloudinary.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim(),

    // Rate limiting configuration
    RATE_LIMIT: {
        AUTH_ATTEMPTS: 5,
        API_REQUESTS: 100,
        TIME_WINDOW: 60 * 1000,
    },

    // Security headers - Updated for Cloudinary
    SECURITY_HEADERS: {
        'X-DNS-Prefetch-Control': 'off',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-XSS-Protection': '1; mode=block',
        // Updated Permissions Policy to allow camera for Cloudinary
        'Permissions-Policy': 'camera=(self "https://upload-widget.cloudinary.com" "https://widget.cloudinary.com"), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    }
};

// Route Configuration
const ROUTE_CONFIG = {
    PUBLIC_ROUTES: [
        '/',
        '/menu',
        '/branches',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/api/public',
    ],

    AUTH_ROUTES: [
        '/api/login',      // Changed from /auth/login
        '/api/register',   // Changed from /auth/register
        '/api/forgot-password', // Changed from /auth/forgot-password
        '/api/reset-password',  // Changed from /auth/reset-password
    ],

    PROTECTED_ROUTES: [
        '/profile',
        '/orders',
        '/track-orders',
        '/settings',
        '/admin',
    ],

    ADMIN_ROUTES: [
        '/admin',
    ],

    SUPER_ADMIN_ROUTES: [
        '/admin/users',
        '/admin/system-settings',
    ],

    API_ROUTES: [
        '/api/admin',
        '/api/user',
    ],
};

// User roles enum
enum UserRole {
    customer = 'customer',
    staff = 'staff',
    branchManager = 'branchManager',
    admin = 'admin',
    superAdmin = 'superAdmin', // Make sure this matches your backend exactly
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Helper Functions
const decodeJWT = (token: string): any | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const paddedPayload = payload + '==='.slice((payload.length + 3) % 4);
        const base64 = paddedPayload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));

        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

const getUserFromToken = (token: string): { role: string; isActive: boolean; id: string; mobileNumber: string } | null => {
    try {
        const decoded = decodeJWT(token);
        if (!decoded) return null;

        // Handle nested userInfo structure from your backend
        const userInfo = decoded.userInfo || decoded;

        return {
            role: userInfo.role || decoded.role,
            isActive: userInfo.isActive !== false, // Default to true if not specified
            id: decoded.id || '',
            mobileNumber: decoded.mobile || decoded.mobileNumber || '',
        };
    } catch (error) {
        console.error('Error extracting user from token:', error);
        return null;
    }
};

const getClientIP = (request: NextRequest): string => {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
};

const checkRateLimit = (ip: string, endpoint: string): boolean => {
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + SECURITY_CONFIG.RATE_LIMIT.TIME_WINDOW,
        });
        return true;
    }

    if (entry.count >= SECURITY_CONFIG.RATE_LIMIT.API_REQUESTS) {
        return false;
    }

    entry.count++;
    return true;
};

const checkAuthRateLimit = (ip: string): boolean => {
    const key = `auth:${ip}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + SECURITY_CONFIG.RATE_LIMIT.TIME_WINDOW,
        });
        return true;
    }

    if (entry.count >= SECURITY_CONFIG.RATE_LIMIT.AUTH_ATTEMPTS) {
        return false;
    }

    entry.count++;
    return true;
};

const isPublicRoute = (pathname: string): boolean => {
    return ROUTE_CONFIG.PUBLIC_ROUTES.some(route => {
        if (route === '/') return pathname === '/';
        return pathname.startsWith(route);
    });
};

const isAuthRoute = (pathname: string): boolean => {
    return ROUTE_CONFIG.AUTH_ROUTES.some(route => pathname.startsWith(route));
};

const isProtectedRoute = (pathname: string): boolean => {
    return ROUTE_CONFIG.PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

const isAdminRoute = (pathname: string): boolean => {
    return pathname.startsWith('/admin');
};

const isSuperAdminRoute = (pathname: string): boolean => {
    return ROUTE_CONFIG.SUPER_ADMIN_ROUTES.some(route => pathname.startsWith(route));
};

const isAPIRoute = (pathname: string): boolean => {
    return pathname.startsWith('/api');
};

const hasRequiredRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
    const roleHierarchy = {
        [UserRole.customer]: 0,
        [UserRole.staff]: 1,
        [UserRole.branchManager]: 2,
        [UserRole.admin]: 3,
        [UserRole.superAdmin]: 4,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

const createSecureResponse = (response: NextResponse): NextResponse => {
    // Add security headers
    Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Add CSP header
    response.headers.set('Content-Security-Policy', SECURITY_CONFIG.CSP_HEADER);

    return response;
};

const createErrorResponse = (
    request: NextRequest,
    status: number,
    message: string,
    redirectTo?: string
): NextResponse => {
    if (redirectTo) {
        const response = NextResponse.redirect(new URL(redirectTo, request.url));
        return createSecureResponse(response);
    }

    const response = new NextResponse(
        JSON.stringify({
            ok: false,
            error: message,
            timestamp: new Date().toISOString(),
        }),
        {
            status,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    return createSecureResponse(response);
};

// Main Middleware Function
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const clientIP = getClientIP(request);

    console.log(`[MIDDLEWARE] ${request.method} ${pathname} from ${clientIP}`);

    // 1. Security Headers for all requests
    const response = NextResponse.next();

    // 2. Rate Limiting
    if (isAPIRoute(pathname)) {
        if (!checkRateLimit(clientIP, pathname)) {
            console.log(`[RATE_LIMIT] API rate limit exceeded for ${clientIP} on ${pathname}`);
            return createErrorResponse(request, 429, 'Rate limit exceeded. Please try again later.');
        }
    }

    // 3. Auth Route Rate Limiting
    if (isAuthRoute(pathname)) {
        if (!checkAuthRateLimit(clientIP)) {
            console.log(`[RATE_LIMIT] Auth rate limit exceeded for ${clientIP}`);
            return createErrorResponse(request, 429, 'Too many authentication attempts. Please try again later.');
        }
    }

    // 4. Handle Public Routes
    if (isPublicRoute(pathname)) {
        console.log(`[PUBLIC] Allowing access to public route: ${pathname}`);
        return createSecureResponse(response);
    }

    // 5. Get and Validate Token
    const accessToken = request.cookies.get('authToken')?.value ||  // Your backend sets this
        request.cookies.get('accessToken')?.value ||                // Fallback
        request.headers.get('authorization')?.replace('Bearer ', '');

    if (!accessToken) {
        console.log(`[AUTH] No token found for protected route: ${pathname}`);

        if (isAPIRoute(pathname)) {
            return createErrorResponse(request, 401, 'Authentication token required');
        }

        // Redirect to home page instead of /auth/login since you use modal
        return createErrorResponse(request, 401, 'Authentication required', '/');
    }

    // 6. Check Token Expiry
    if (isTokenExpired(accessToken)) {
        console.log(`[AUTH] Expired token for route: ${pathname}`);

        if (isAPIRoute(pathname)) {
            return createErrorResponse(request, 401, 'Token expired');
        }

        // Redirect to home page instead of /auth/login
        const response = createErrorResponse(request, 401, 'Session expired', '/');
        response.cookies.delete('accessToken');
        return response;
    }

    // 7. Extract User Information
    const user = getUserFromToken(accessToken);
    if (!user) {
        console.log(`[AUTH] Invalid token for route: ${pathname}`);

        if (isAPIRoute(pathname)) {
            return createErrorResponse(request, 403, 'Invalid authentication token');
        }

        // Redirect to home page instead of /auth/login
        const response = createErrorResponse(request, 403, 'Invalid session', '/');
        response.cookies.delete('accessToken');
        return response;
    }

    // 8. Check if User is Active
    if (!user.isActive) {
        console.log(`[AUTH] Inactive user ${user.id} attempted to access: ${pathname}`);

        if (isAPIRoute(pathname)) {
            return createErrorResponse(request, 403, 'Account is deactivated');
        }

        // Redirect to home page instead of /auth/login
        return createErrorResponse(request, 403, 'Your account has been deactivated', '/');
    }

    // 9. Redirect authenticated users away from auth pages (but not home page)
    if (isAuthRoute(pathname) && pathname !== '/') {
        console.log(`[REDIRECT] Authenticated user trying to access auth route: ${pathname}`);
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // 9.5. Auto-redirect to admin if user is already logged in and on home page
    console.log(`[DEBUG] Current path: ${pathname}, User:`, user);

    if (pathname === '/' && user) {
        console.log(`[DEBUG] User role: ${user.role}, Type: ${typeof user.role}`);

        if (user.role === 'superAdmin' || user.role === 'admin') {
            console.log(`[AUTO_REDIRECT] Admin user on home page, redirecting to admin panel via middleware`);
            return NextResponse.redirect(new URL('/admin', request.url));
        } else {
            console.log(`[DEBUG] User role ${user.role} does not match admin roles`);
        }
    }

    // 10. Check Admin Route Access
    if (isAdminRoute(pathname)) {
        const hasAdminAccess = hasRequiredRole(user.role as UserRole, UserRole.staff);

        if (!hasAdminAccess) {
            console.log(`[ADMIN] User ${user.id} with role ${user.role} denied access to: ${pathname}`);

            if (isAPIRoute(pathname)) {
                return createErrorResponse(request, 403, 'Admin access required');
            }

            return createErrorResponse(request, 403, 'Admin access required', '/');
        }
    }

    // 11. Check Super Admin Route Access
    if (isSuperAdminRoute(pathname)) {
        if (user.role !== UserRole.superAdmin && user.role !== UserRole.admin) {
            console.log(`[SUPER_ADMIN] User ${user.id} with role ${user.role} denied access to: ${pathname}`);

            if (isAPIRoute(pathname)) {
                return createErrorResponse(request, 403, 'Insufficient permissions');
            }

            return createErrorResponse(request, 403, 'Insufficient permissions', '/admin');
        }
    }

    // 12. Specific route permissions
    if (pathname.startsWith('/admin/users')) {
        // SuperAdmin can access all user management features
        // Admin can access user management but with restrictions
        const canAccessUsers = user.role === 'superAdmin' ||
            user.role === 'admin' ||
            user.role === UserRole.superAdmin ||
            user.role === UserRole.admin;

        if (!canAccessUsers) {
            console.log(`[USERS] User ${user.id} with role ${user.role} denied access to users section`);

            if (isAPIRoute(pathname)) {
                return createErrorResponse(request, 403, 'Users management access denied');
            }

            return createErrorResponse(request, 403, 'Access denied', '/admin');
        }
    }

    // 13. API Endpoint Specific Checks for DELETE operations
    if (pathname.startsWith('/api/admin/users') && request.method === 'DELETE') {
        // Only superAdmin can delete users
        if (user.role !== 'superAdmin' && user.role !== UserRole.superAdmin) {
            console.log(`[DELETE_USER] User ${user.id} with role ${user.role} denied delete access`);
            return createErrorResponse(request, 403, 'Only super admin can delete users');
        }
    }

    // 14. Add user info to request headers for backend use
    const modifiedResponse = createSecureResponse(response);
    modifiedResponse.headers.set('x-user-id', user.id);
    modifiedResponse.headers.set('x-user-role', user.role);
    modifiedResponse.headers.set('x-client-ip', clientIP);

    console.log(`[SUCCESS] User ${user.id} (${user.role}) granted access to: ${pathname}`);

    return modifiedResponse;
}

// Middleware Configuration
export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};