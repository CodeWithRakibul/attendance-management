'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction as any, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-gray-800">
            Coaching Management
          </CardTitle>
          <p className="text-center text-sm text-gray-500">
            Enter your credentials to access the dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="admin"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
              />
            </div>
            
            {state?.error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
                {state.error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Logging in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            <p className="font-medium text-gray-600 mb-1">Demo Credentials:</p>
            <p>Admin: admin / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}