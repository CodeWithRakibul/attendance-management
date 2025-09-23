'use server'

import { authenticateUser } from '../auth'

export interface ActionResult {
  success: boolean
  message: string
  data?: any
}

export async function login(formData: FormData): Promise<ActionResult> {
  try {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const user = authenticateUser(username, password)

    if (!user) {
      return {
        success: false,
        message: 'Invalid username or password'
      }
    }

    return {
      success: true,
      message: 'Login successful',
      data: { user }
    }
  } catch {
    return {
      success: false,
      message: 'An error occurred during login'
    }
  }
}