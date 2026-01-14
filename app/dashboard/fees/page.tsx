import { getFeeMasters } from '@/queries/fee'
import { getCurrentSession } from '@/queries/session'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Wallet } from 'lucide-react'
import { format } from 'date-fns'

export default async function FeesPage() {
    const session = await getCurrentSession()
    
    if (!session) {
        return (
            <div className="p-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>No Active Session</CardTitle>
                        <CardDescription>Please activate a session to manage fees.</CardDescription>
                    </CardHeader>
                 </Card>
            </div>
        )
    }

    const fees = await getFeeMasters(session.id)

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
                    <p className="text-muted-foreground">Manage fee structures and collections for {session.year}</p>
                </div>
                <div className="space-x-2">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/fees/collection">
                            <Wallet className="mr-2 h-4 w-4" />
                            Collections
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/fees/setup">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Setup Fee
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {fees.map((fee) => (
                    <Card key={fee.id}>
                        <CardHeader>
                            <CardTitle>{fee.name}</CardTitle>
                            <CardDescription>{fee.type}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">৳ {fee.amount.toLocaleString()}</div>
                            {fee.dueDate && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Due: {format(new Date(fee.dueDate), 'MMM d, yyyy')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {fees.length === 0 && (
                    <Card className="col-span-full border-dashed p-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-muted-foreground">No fee structures defined yet.</p>
                            <Button variant="link" asChild>
                                <Link href="/dashboard/fees/setup">Create your first fee</Link>
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
