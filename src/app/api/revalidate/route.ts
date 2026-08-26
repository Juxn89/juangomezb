import {revalidateTag} from 'next/cache';
import {timingSafeEqual} from 'crypto';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
	const authHeader = request.headers.get('authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return NextResponse.json({message: 'Unauthorized'}, {status: 401});
	}

	const secret = authHeader.slice(7); // Remove "Bearer " prefix
	const expectedSecret = process.env.REVALIDATE_SECRET;

	if (!expectedSecret) {
		return NextResponse.json({message: 'Server misconfigured'}, {status: 500});
	}

	try {
		if (!timingSafeEqual(Buffer.from(secret), Buffer.from(expectedSecret))) {
			return NextResponse.json({message: 'Unauthorized'}, {status: 401});
		}
	} catch {
		return NextResponse.json({message: 'Unauthorized'}, {status: 401});
	}

	revalidateTag('devto-articles', 'default');

	return NextResponse.json({revalidated: true, timestamp: new Date().toISOString()});
}
