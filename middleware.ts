import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For demo, just redirect to login if accessing dashboard without being logged in
  // In a real app, you'd check for valid session/token
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Simple check - in real app you'd verify actual auth token
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}