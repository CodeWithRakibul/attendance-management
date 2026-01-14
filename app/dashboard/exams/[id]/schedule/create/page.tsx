import { getExamById } from '@/queries/exam'
import { getClasses } from '@/queries'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ScheduleForm from './schedule-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
    params: Promise<{ id: string }>
}

export default async function CreateSchedulePage({ params }: Props) {
    const { id } = await params
    const exam = await getExamById(id)

    if (!exam) {
        notFound()
    }

    const classes = await getClasses(exam.sessionId)

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/exams/${id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Add Schedule</h1>
                    <p className="text-muted-foreground">Add a new paper/subject to {exam.name}</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Schedule Details</CardTitle>
                        <CardDescription>Enter the details for the exam paper.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScheduleForm examId={exam.id} classes={classes} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
