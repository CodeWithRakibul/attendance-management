import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { encrypt, UserRole } from './session'

export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) return null

  const passwordsMatch = await bcrypt.compare(password, user.password)
  if (!passwordsMatch) return null

  return {
    id: user.id,
    username: user.username,
    role: user.role
  }
}

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const user = await authenticateUser(username, password)

  if (!user) return null

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  // Ensure the role matches the enum in session.ts (casts string to enum)
  const session = await encrypt({ id: user.id, username: user.username, role: user.role as UserRole, expires })

  // Save the session in a cookie
  const cookieStore = await cookies()
  cookieStore.set('session', session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/' 
  })

  return user
}