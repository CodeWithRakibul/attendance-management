'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SessionsDataTable } from './sessions-data-table';
import { SessionDialog } from './session-dialog';
import { IconCalendar } from '@tabler/icons-react';

interface SessionsPageContentProps {
    sessions: any[];
}

export function SessionsPageContent({ sessions }: SessionsPageContentProps) {
    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Sessions</h2>
                    <p className='text-muted-foreground'>
                        Manage academic sessions and years.
                    </p>
                </div>
                <SessionDialog />
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <IconCalendar className='h-5 w-5 text-muted-foreground' />
                        <div>
                            <CardTitle>All Sessions</CardTitle>
                            <CardDescription>
                                List of all academic sessions in the system.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <SessionsDataTable sessions={sessions} />
                </CardContent>
            </Card>
        </div>
    );
}
