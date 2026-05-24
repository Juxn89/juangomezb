import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './src/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Simplified rate limiting (in-memory, no cleanup interval for Edge compatibility)
type RateLimitStore = Map<string, {count: number; resetTime: number}>;
const rateLimitStore: RateLimitStore = new Map();
const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier: string): boolean {
	const now = Date.now();
	const record = rateLimitStore.get(identifier);

	// Lazy cleanup: if expired, treat as new
	if (!record || now > record.resetTime) {
		rateLimitStore.set(identifier, {count: 1, resetTime: now + RATE_LIMIT_WINDOW});
		return true;
	}

	if (record.count >= RATE_LIMIT_MAX) {
		return false;
	}

	record.count++;
	return true;
}

// Pre-build static security headers
const SECURITY_HEADERS = {
	'X-Frame-Options': 'DENY',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'Content-Security-Policy':
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://dev.to; frame-ancestors 'none';",
};

export async function middleware(request: NextRequest) {
	// Fast path for assets - skip security checks
	const pathname = request.nextUrl.pathname;
	if (pathname.includes('.') && !pathname.endsWith('.html')) {
		return NextResponse.next();
	}

	// Get client IP
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

	// Rate limiting
	if (!checkRateLimit(ip)) {
		return NextResponse.json(
			{error: 'Too many requests'},
			{status: 429, headers: {'Retry-After': '900'}}
		);
	}

	// Handle internationalization
	const response = intlMiddleware(request);

	// Add security headers (pre-built for performance)
	Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
		response.headers.set(key, value);
	});

	return response;
}

export const config = {
	// Match all pathnames except static files and api routes
	matcher: [
		// Match all pathnames except for
		// - … if they start with `/api`, `/_next` or `/_vercel`
		// - … the ones containing a dot (e.g. `favicon.ico`)
		'/((?!api|_next|_vercel|.*\\..*).*)',
	],
};
