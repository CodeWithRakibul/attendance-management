import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ExamForm from './exam-form'
import { getCurrentSession } from '@/queries/session'

export default async function CreateExamPage() {
    const session = await getCurrentSession()
    
    if (!session) {
        return <div>No active session</div>
    }

    return (
        <div className="p-6">
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Create New Exam</CardTitle>
                    <CardDescription>Schedule a new examination for {session.year}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExamForm sessionId={session.id} />
                </CardContent>
            </Card>
        </div>
    )
}
