import { getExamSchedule } from '@/queries/exam'
import { getStudents } from '@/queries/student'
import { notFound } from 'next/navigation'
import MarksForm from './marks-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
    params: Promise<{ id: string }>
}

export default async function ExamMarksPage({ params }: Props) {
    const { id } = await params
    const schedule = await getExamSchedule(id)

    if (!schedule) {
        notFound()
    }

    const students = await getStudents(schedule.exam.sessionId, { classId: schedule.classId })

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/exams/${schedule.examId}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Manage Marks</h1>
                    <p className="text-muted-foreground">
                        {schedule.exam.name} - {schedule.subject} ({schedule.class.name})
                    </p>
                </div>
            </div>

            <div className="flex gap-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
                 <div>
                    <span className="font-semibold text-gray-900">Date:</span> {format(new Date(schedule.date), 'MMM d, yyyy')}
                 </div>
                 <div>
                    <span className="font-semibold text-gray-900">Time:</span> {schedule.startTime} - {schedule.endTime}
                 </div>
                 <div>
                    <span className="font-semibold text-gray-900">Full Marks:</span> {schedule.fullMark}
                 </div>
            </div>

            <MarksForm 
                scheduleId={schedule.id} 
                fullMark={schedule.fullMark} 
                students={students} 
                existingMarks={schedule.marks} 
            />
        </div>
    )
}
