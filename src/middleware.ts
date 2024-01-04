import {NextResponse} from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Assume a 'Cookie:nextjs=fast' header to be present on the incoming request
    // Getting cookies from the request using the 'RequestCookies' API
    const {pathname, searchParams} = request.nextUrl;
    
    console.log(pathname)
    console.log(searchParams)
    let cookie = request.cookies.get('next-auth.csrf-token')?.value

    console.log('cookie', cookie)
    const allCookies = request.cookies.getAll()
    console.log('allCookies', allCookies)

    return NextResponse.next()
}

export const config = {
    matcher: '/'
}