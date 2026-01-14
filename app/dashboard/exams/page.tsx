import { prisma } from '@/lib/prisma'
import { getExams } from '@/queries/exam'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Clock, BookOpen } from 'lucide-react'

// Assuming this exists in queries/session.ts, otherwise I'll use prisma direct or fallback
import { getCurrentSession } from '@/queries/session'

export default async function ExamPage() {
  const session = await getCurrentSession()
  
  if (!session) {
      return (
          <div className="p-6">
              <Card>
                  <CardHeader>
                      <CardTitle>No Active Session</CardTitle>
                      <CardDescription>Please ask an admin to create or activate a session.</CardDescription>
                  </CardHeader>
              </Card>
          </div>
      )
  }

  const exams = await getExams(session.id)

  return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
                <p className="text-muted-foreground">Manage exams and results for {session.year}</p>
            </div>
            <Button asChild>
                <Link href="/dashboard/exams/create">Create Exam</Link>
            </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {exams.map((exam) => (
                 <Card key={exam.id} className="cursor-pointer hover:shadow-md transition-all">
                    <Link href={`/dashboard/exams/${exam.id}`}>
                        <CardHeader>
                            <CardTitle>{exam.name}</CardTitle>
                            <CardDescription className={`font-medium ${
                                exam.status === 'UPCOMING' ? 'text-blue-500' :
                                exam.status === 'ONGOING' ? 'text-green-500' :
                                exam.status === 'COMPLETED' ? 'text-orange-500' :
                                'text-gray-500'
                            }`}>
                                {exam.status}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="mr-2 h-4 w-4" />
                                {format(new Date(exam.startDate), 'MMM d')} - {format(new Date(exam.endDate), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <BookOpen className="mr-2 h-4 w-4" />
                                {exam._count.schedules} Papers scheduled
                            </div>
                        </CardContent>
                    </Link>
                 </Card>
             ))}

             {exams.length === 0 && (
                 <Card className="col-span-full border-dashed">
                    <CardHeader className="text-center">
                        <CardTitle>No Exams Found</CardTitle>
                        <CardDescription>There are no exams scheduled for this session.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-6">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/exams/create">Create First Exam</Link>
                        </Button>
                    </CardContent>
                 </Card>
             )}
        </div>
      </div>
  )
}
