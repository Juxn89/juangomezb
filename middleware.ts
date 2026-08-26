import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './src/routing';

// List of blocked/malicious user agents (scrapers, scanners, exploitation tools)
const BLOCKED_USER_AGENTS = [
	'python-requests', // Python HTTP library (commonly used by bots)
	'scrapy', // Web scraping framework
	'sqlmap', // SQL injection testing tool
	'nikto', // Web server scanner
	'nessus', // Vulnerability scanner
	'nmap', // Network mapper/port scanner
	'cms-checker', // CMS vulnerability scanner
	'palo alto', // Palo Alto Networks scanner
	'nuclei', // Vulnerability scanner
	'burpsuite', // Web application security testing
	'metasploit', // Exploitation framework
	'zap', // OWASP ZAP security scanner
	'masscan', // Rapid network scanner
	'shodan', // Search engine for devices (scanning tool context)
];

function isBlockedUserAgent(userAgent: string): boolean {
	const ua = userAgent.toLowerCase();
	return BLOCKED_USER_AGENTS.some((pattern) => ua.includes(pattern));
}

// Paths targeted by vulnerability scanners (CMS/WordPress/PHP probes, config exposure)
const SCANNER_PATHS = [
	/^\/.env/i, // .env file exposure
	/^\/.git\//i, // Git repo exposure
	/^\/.vscode\//i, // VSCode settings
	/sftp-config/i, // SFTP credentials
	/\.php$/i, // PHP files (Next.js doesn't serve PHP)
	/^\/wp-/i, // WordPress paths
	/wlwmanifest/i, // WordPress manifest
	/^\/admin\//i, // Generic admin panels
	/^\/administrator\//i, // Joomla admin
	/\/cms\//i, // CMS paths
	/\/data\//i, // Data directories
	/\/zb_users\//i, // ZbBlog
	/\/ucms\//i, // UCMS
	/\/plus\//i, // DedeCMS
	/\/dayui\//i, // Dayui CMS
	/shell\.php/i, // Web shells
	/makeasmtp\.php/i, // Mail exploit
	/adminfuns/i, // Admin functions
	/\/include\/ckeditor/i, // CMS editors
	/\/plugins\//i, // Plugin directories
	/\/themes\//i, // Theme directories
	/\/modules\//i, // Module directories
];

function isScannerPath(pathname: string): boolean {
	return SCANNER_PATHS.some((pattern) => pattern.test(pathname));
}

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Simplified rate limiting (in-memory, no cleanup interval for Edge compatibility)
type RateLimitStore = Map<string, {count: number; resetTime: number}>;
const rateLimitStore: RateLimitStore = new Map();
const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_API_MAX = 5;
const RATE_LIMIT_API_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier: string, isApi: boolean = false): boolean {
	const now = Date.now();
	const max = isApi ? RATE_LIMIT_API_MAX : RATE_LIMIT_MAX;
	const window = isApi ? RATE_LIMIT_API_WINDOW : RATE_LIMIT_WINDOW;
	const key = isApi ? `api:${identifier}` : identifier;
	const record = rateLimitStore.get(key);

	// Lazy cleanup: if expired, treat as new
	if (!record || now > record.resetTime) {
		rateLimitStore.set(key, {count: 1, resetTime: now + window});
		return true;
	}

	if (record.count >= max) {
		return false;
	}

	record.count++;
	return true;
}

function getClientIp(request: NextRequest): string {
	// Prioritize Cloudflare's header, fallback to x-forwarded-for (Vercel/proxies)
	const cfConnectingIp = request.headers.get('cf-connecting-ip');
	if (cfConnectingIp) {
		return cfConnectingIp.split(',')[0]?.trim() || 'unknown';
	}
	return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function generateNonce(): string {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function buildCsp(nonce: string, isProduction: boolean): string {
	const baseCsp = [
		"default-src 'self'",
		isProduction
			? `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com`
			: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob: https://media2.dev.to https://dev-to-uploads.s3.amazonaws.com https://avatars.githubusercontent.com",
		"font-src 'self' data:",
		"connect-src 'self' https://vitals.vercel-insights.com https://dev.to https://api.github.com",
		"frame-ancestors 'none'",
	];
	return baseCsp.join('; ');
}

function timingSafeEqual(a: string, b: string): boolean {
	const enc = new TextEncoder();
	const aBytes = enc.encode(a);
	const bBytes = enc.encode(b);
	if (aBytes.length !== bBytes.length) return false;
	let result = 0;
	for (let i = 0; i < aBytes.length; i++) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		result |= aBytes[i]! ^ bBytes[i]!;
	}
	return result === 0;
}

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Fast path for assets - skip security checks
	if (pathname.includes('.') && !pathname.endsWith('.html')) {
		return NextResponse.next();
	}

	// Get client IP
	const ip = getClientIp(request);

	// Check origin-shield if configured (prevents bypass to Vercel origin)
	const originShieldSecret = process.env.ORIGIN_SHIELD_SECRET;
	if (originShieldSecret) {
		const shieldHeader = request.headers.get('x-origin-shield') || '';
		if (!timingSafeEqual(shieldHeader, originShieldSecret)) {
			return NextResponse.json({error: 'Forbidden'}, {status: 404});
		}
	}

	// Block vulnerability scanner paths (CMS/WordPress/PHP probes, config exposure)
	if (isScannerPath(pathname)) {
		return NextResponse.json({error: 'Not found'}, {status: 404, headers: {'Retry-After': '3600'}});
	}

	// Block known malicious/scraping user agents
	const userAgent = request.headers.get('user-agent') || '';
	if (isBlockedUserAgent(userAgent)) {
		return NextResponse.json(
			{error: 'Access denied'},
			{status: 403, headers: {'Retry-After': '3600'}}
		);
	}

	// Rate limiting (differentiated for API routes)
	const isApiRoute = pathname.startsWith('/api');
	if (!checkRateLimit(ip, isApiRoute)) {
		return NextResponse.json(
			{error: 'Too many requests'},
			{status: 429, headers: {'Retry-After': '900'}}
		);
	}

	// Generate nonce for CSP
	const nonce = generateNonce();
	const isProduction = process.env.NODE_ENV === 'production';

	// For API routes, return immediately without i18n middleware
	if (isApiRoute) {
		const response = NextResponse.next();
		// Add security headers to API responses
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
		response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
		response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
		return response;
	}

	// Set nonce in request headers for propagation to client-side via headers() function
	request.headers.set('x-nonce', nonce);

	// Handle internationalization
	const response = intlMiddleware(request);

	// Add security headers
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
	response.headers.set('Content-Security-Policy', buildCsp(nonce, isProduction));

	return response;
}

export const config = {
	matcher: [
		// Match all pathnames except for static files, _next, and _vercel
		'/((?!_next|_vercel|.*\\..*).*)',
	],
};
