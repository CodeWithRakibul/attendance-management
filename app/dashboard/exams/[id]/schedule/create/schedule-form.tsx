'use client'

import { useActionState } from 'react'
import { createScheduleAction } from '@/actions/exam'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { Class } from '@prisma/client'

interface Props {
    examId: string
    classes: Class[]
}

export default function ScheduleForm({ examId, classes }: Props) {
    const [state, action, isPending] = useActionState(createScheduleAction as any, { success: false, error: '' })
    const router = useRouter()

    if (state?.success) {
        // Redirect back to exam detail page
        router.push(`/dashboard/exams/${examId}`)
    }

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="examId" value={examId} />
            
            <div className="space-y-2">
                <Label htmlFor="classId">Class</Label>
                <Select name="classId" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="e.g. Mathematics" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" name="startTime" type="time" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" name="endTime" type="time" required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="fullMark">Full Marks</Label>
                <Input id="fullMark" name="fullMark" type="number" min="1" placeholder="e.g. 100" required />
            </div>

            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

            <Button type="submit" disabled={isPending}>
                {isPending ? 'Adding Schedule...' : 'Add Schedule'}
            </Button>
        </form>
    )
}
