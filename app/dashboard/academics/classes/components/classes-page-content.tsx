'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { ClassesDataTable } from './classes-data-table';
import { ClassDialog } from './class-dialog';
import { IconSchool } from '@tabler/icons-react';

interface ClassesPageContentProps {
    classes: any[];
    sessions: any[];
    currentSessionId: string;
}

export function ClassesPageContent({ classes, sessions, currentSessionId }: ClassesPageContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSessionChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('session', value);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-3xl font-bold tracking-tight'>Classes</h2>
                    <p className='text-muted-foreground'>
                        Manage classes for academic sessions.
                    </p>
                </div>
                <div className='flex items-center gap-4'>
                     <Select
                        value={currentSessionId}
                        onValueChange={handleSessionChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                            {sessions.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <ClassDialog sessions={sessions} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <IconSchool className='h-5 w-5 text-muted-foreground' />
                        <div>
                            <CardTitle>All Classes</CardTitle>
                            <CardDescription>
                                List of classes in the selected session.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ClassesDataTable classes={classes} sessions={sessions} />
                </CardContent>
            </Card>
        </div>
    );
}
