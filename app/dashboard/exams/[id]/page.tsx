import { getExamById } from '@/queries/exam'
import { ExamSchedule, Class } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Clock, ArrowLeft, FileEdit } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export default async function ExamDetailPage({ params }: Props) {
    const { id } = await params
    const exam = await getExamById(id)

    if (!exam) {
        notFound()
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/exams">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{exam.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(exam.startDate), 'MMM d')} - {format(new Date(exam.endDate), 'MMM d, yyyy')}</span>
                        <Badge variant={exam.status === 'COMPLETED' ? 'secondary' : 'default'} className="ml-2">
                            {exam.status}
                        </Badge>
                    </div>
                </div>
                <div className="ml-auto">
                    <Button asChild>
                        <Link href={`/dashboard/exams/${exam.id}/schedule/create`}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Add Schedule
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Exam Schedule</CardTitle>
                        <CardDescription>List of papers and timings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {exam.schedules.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No schedules added yet.</p>
                        ) : (
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Time</th>
                                            <th className="px-6 py-3">Class</th>
                                            <th className="px-6 py-3">Subject</th>
                                            <th className="px-6 py-3">Marks</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exam.schedules.map((schedule: ExamSchedule & { class: Class }) => (
                                            <tr key={schedule.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">
                                                    {format(new Date(schedule.date), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {schedule.startTime} - {schedule.endTime}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">{schedule.class.name}</td>
                                                <td className="px-6 py-4">{schedule.subject}</td>
                                                <td className="px-6 py-4">{schedule.fullMark}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="link" size="sm" asChild>
                                                        <Link href={`/dashboard/exams/marks/${schedule.id}`}>
                                                            Manage Marks
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
