import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './src/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Rate limiting store (in-memory for now)
type RateLimitStore = Map<string, {count: number; resetTime: number}>;
const rateLimitStore: RateLimitStore = new Map();

// Rate limiter configuration
const RATE_LIMIT_CONFIG = {
	maxRequests: 100,
	windowMs: 15 * 60 * 1000, // 15 minutes
};

function checkRateLimit(identifier: string): {success: boolean; remaining: number} {
	const now = Date.now();
	const record = rateLimitStore.get(identifier);

	if (!record || now > record.resetTime) {
		rateLimitStore.set(identifier, {
			count: 1,
			resetTime: now + RATE_LIMIT_CONFIG.windowMs,
		});
		return {success: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1};
	}

	if (record.count >= RATE_LIMIT_CONFIG.maxRequests) {
		return {success: false, remaining: 0};
	}

	record.count++;
	rateLimitStore.set(identifier, record);
	return {success: true, remaining: RATE_LIMIT_CONFIG.maxRequests - record.count};
}

// Cleanup old entries every minute
setInterval(() => {
	const now = Date.now();
	for (const [key, value] of rateLimitStore.entries()) {
		if (now > value.resetTime) {
			rateLimitStore.delete(key);
		}
	}
}, 60000);

export async function middleware(request: NextRequest) {
	// Get client IP from headers (Next.js 16.2 doesn't have request.ip)
	const ip =
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		request.headers.get('x-real-ip') ||
		'unknown';
	const userAgent = request.headers.get('user-agent') || '';

	// 1. Rate Limiting
	const rateLimitResult = checkRateLimit(ip);
	if (!rateLimitResult.success) {
		return NextResponse.json(
			{error: 'Too many requests'},
			{
				status: 429,
				headers: {'Retry-After': '900'},
			}
		);
	}

	// 2. Bot Detection (basic)
	const suspiciousBots = ['curl', 'wget', 'python-requests', 'scrapy'];
	if (suspiciousBots.some((bot) => userAgent.toLowerCase().includes(bot))) {
		return NextResponse.json({error: 'Forbidden'}, {status: 403});
	}

	// 3. Handle internationalization
	const response = intlMiddleware(request);

	// 4. Add Security Headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com https://dev.to; frame-ancestors 'none';"
	);

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
