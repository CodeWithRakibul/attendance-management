import { Suspense } from 'react'
import { StudentSearch } from './components/student-search'
import { StudentFeePayment } from './components/student-fee-payment'
import { getStudentByIdAction } from '@/actions/student'
import { getFeeMastersAction, getStudentCollectionsAction } from '@/actions/fee'
import { getCurrentSession } from '@/actions/student'
import { Separator } from '@/components/ui/separator'

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FeeCollectionPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const studentId = typeof params.studentId === 'string' ? params.studentId : undefined

    let student = null
    let feeMasters: any[] = []
    let collections: any[] = []
    let session = await getCurrentSession()

    if (studentId && session) {
        try {
            // Fetch student by database ID or Student ID (we'll assume database ID for now, or handle logic in component)
            // But wait, getStudentByIdAction expects database ID.
            // The search component should probably return the database ID.
            student = await getStudentByIdAction(studentId)
            feeMasters = await getFeeMastersAction(session.id)
            collections = await getStudentCollectionsAction(studentId)
        } catch (error) {
            console.error('Failed to fetch data', error)
        }
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h3 className="text-lg font-medium">Fee Collection</h3>
                <p className="text-sm text-muted-foreground">
                    Search for a student to collect fees.
                </p>
            </div>
            <Separator />

            <StudentSearch />

            {student ? (
                <StudentFeePayment
                    student={student}
                    feeMasters={feeMasters}
                    collections={collections}
                    sessionId={session?.id || ''}
                />
            ) : studentId ? (
                <div className="text-center py-10 text-muted-foreground">
                    Student not found.
                </div>
            ) : null}
        </div>
    )
}
