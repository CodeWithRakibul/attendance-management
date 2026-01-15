import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/session'
import { getSession } from '@/lib/session'

export async function proxy(request: NextRequest) {
  // Update session expiration if valid
  await updateSession(request)

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = await getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect to dashboard if already logged in and accessing login page
  if (request.nextUrl.pathname.startsWith('/login')) {
    const session = await getSession()
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
