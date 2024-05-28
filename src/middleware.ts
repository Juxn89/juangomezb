import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	if(request.url === '/')
		return NextResponse.redirect(new URL('/en', request.url))

  return NextResponse.redirect(new URL('/en', request.url))
}

export const config = {
  matcher: ['/', '/:lang'],
}