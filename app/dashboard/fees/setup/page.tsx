import { Suspense } from 'react'
import { getCurrentSession } from '@/actions/student'
import { getFeeMastersAction } from '@/actions/fee'
import { FeeSetupForm } from './components/fee-setup-form'
import { FeeMasterList } from './components/fee-master-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function FeeSetupPage() {
    const session = await getCurrentSession()

    if (!session) {
        return <div>Please create a session first.</div>
    }

    const feeMasters = await getFeeMastersAction(session.id)

    return (
        <div className="space-y-6 p-6">
            <div>
                <h3 className="text-lg font-medium">Fee Configuration</h3>
                <p className="text-sm text-muted-foreground">
                    Manage fee structures for the current session ({session.year}).
                </p>
            </div>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Fee</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FeeSetupForm sessionId={session.id} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Existing Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FeeMasterList data={feeMasters} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
