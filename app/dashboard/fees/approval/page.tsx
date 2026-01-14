import { Suspense } from 'react'
import { getCurrentSession } from '@/actions/student'
import { getPendingCollectionsAction } from '@/actions/fee'
import { ApprovalList } from './components/approval-list'
import { Separator } from '@/components/ui/separator'

export default async function FeeApprovalPage() {
    const session = await getCurrentSession()

    if (!session) {
        return <div>Please create a session first.</div>
    }

    const pendingCollections = await getPendingCollectionsAction(session.id)

    return (
        <div className="space-y-6 p-6">
            <div>
                <h3 className="text-lg font-medium">Fee Approval</h3>
                <p className="text-sm text-muted-foreground">
                    Review and approve pending fee collections.
                </p>
            </div>
            <Separator />

            <div className="bg-white rounded-lg border p-4">
                <ApprovalList data={pendingCollections} />
            </div>
        </div>
    )
}
