import { getServerSession } from 'next-auth';
import {NextResponse} from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Assume a 'Cookie:nextjs=fast' header to be present on the incoming request
    // Getting cookies from the request using the 'RequestCookies' API
    const {pathname, searchParams} = request.nextUrl;

    let cookie = request.cookies.get('next-auth.csrf-token')?.value
    let sessionCookie = request.cookies.get('next-auth.session-token')?.value

    const allCookies = request.cookies.getAll()
    console.log('allCookies', allCookies)

    if(!sessionCookie) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/create/:path*']
}