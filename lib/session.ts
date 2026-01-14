import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
// We define the type manually to avoid importing from @prisma/client in Edge Runtime if possible, 
// or strictly import type. 
// However, importing value (enum) from @prisma/client might be risky in Edge.
// Let's redefine UserRole here for safety, or import it if we are sure.
// Safest is to redefine for the session payload to be independent.
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  EMPLOYEE = 'EMPLOYEE'
}

const secretKey = process.env.AUTH_SECRET || 'your-super-secret-key-change-this'
const key = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  id: string
  username: string
  role: UserRole
  expires: Date
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session)
  
  if (!parsed) {
    return
  }

  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
    sameSite: 'lax',
    path: '/'
  })
  return res
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
