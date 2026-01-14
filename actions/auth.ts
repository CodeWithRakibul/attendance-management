'use server'

import { login } from '@/lib/auth'
import { logout } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  const user = await login(formData)
  
  if (!user) {
    return { error: 'Invalid username or password' }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  await logout()
  redirect('/login')
}
