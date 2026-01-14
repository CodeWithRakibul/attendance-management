'use client'

import { useActionState } from 'react'
import { createExamAction } from '@/actions/exam'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
// import { getActiveSession } from '@/queries/session' // Queries can't be imported in client components directly? 
// No, server actions used. But we need sessionId.
// Better to fetch sessionId in Server Component (Page) and pass it to Client Component (Form)
// So I will create a Client Form component and a Server Page.

export default function CreateExamForm({ sessionId }: { sessionId: string }) {
    const [state, action, isPending] = useActionState(createExamAction as any, { success: false, error: '' })
    const router = useRouter()

    if (state?.success) {
        // Redirect handled by revalidatePath? No, action handles revalidate but client needs to redirect.
        // Actually, redirect in server action is best. I didn't add redirect in action, just revalidate.
        // I should add redirect in action or handle here.
        router.push('/dashboard/exams')
    }

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="sessionId" value={sessionId} />
            
            <div className="space-y-2">
                <Label htmlFor="name">Exam Name</Label>
                <Input id="name" name="name" placeholder="e.g. First Term Examination 2025" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" name="endDate" type="date" required />
                </div>
            </div>

            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

            <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Exam'}
            </Button>
        </form>
    )
}
