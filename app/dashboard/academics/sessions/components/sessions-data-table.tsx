'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconTrash } from '@tabler/icons-react'; // Changed from IconMoreVertical to IconDotsVertical and removed IconEdit
import { SessionDialog } from './session-dialog';
import { deleteSessionAction } from '@/actions/academics';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Session {
    id: string;
    year: string;
    status: 'ACTIVE' | 'CLOSED';
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        classes: number;
        students: number;
    };
}

interface SessionsDataTableProps {
    sessions: Session[];
}

export function SessionsDataTable({ sessions }: SessionsDataTableProps) {
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) return;
        
        try {
            const result = await deleteSessionAction(id);
            if (result.success) {
                toast.success('Session deleted successfully');
            } else {
                toast.error(result.error as string);
            }
        } catch (error) {
            toast.error('Failed to delete session');
        }
    };

    return (
        <div className='rounded-md border'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Year / Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className='h-24 text-center'>
                                No sessions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sessions.map((session) => (
                            <TableRow key={session.id}>
                                <TableCell className='font-medium'>{session.year}</TableCell>
                                <TableCell>
                                    <Badge variant={session.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                        {session.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(new Date(session.createdAt), 'PP')}</TableCell>
                                <TableCell className='text-right'>
                                    <div className='flex justify-end gap-2'>
                                        <SessionDialog session={session} />
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='text-destructive'
                                            onClick={() => handleDelete(session.id)}
                                        >
                                            <IconTrash className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
