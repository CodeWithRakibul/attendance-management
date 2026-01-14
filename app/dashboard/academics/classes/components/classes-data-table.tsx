'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconTrash } from '@tabler/icons-react';
import { ClassDialog } from './class-dialog';
import { deleteClassAction } from '@/actions/academics';
import { toast } from 'sonner';

interface ClassItem {
    id: string;
    name: string;
    sessionId: string;
    _count?: {
        students: number;
    };
    batches?: { id: string; name: string }[];
    sections?: { id: string; name: string }[];
}

interface ClassesDataTableProps {
    classes: ClassItem[];
    sessions: { id: string; year: string }[];
}

export function ClassesDataTable({ classes, sessions }: ClassesDataTableProps) {
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) return;
        
        try {
            const result = await deleteClassAction(id);
            if (result.success) {
                toast.success('Class deleted successfully');
            } else {
                toast.error(result.error as string);
            }
        } catch (error) {
            toast.error('Failed to delete class');
        }
    };

    return (
        <div className='rounded-md border'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Batches</TableHead>
                        <TableHead>Sections</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className='h-24 text-center'>
                                No classes found for this session.
                            </TableCell>
                        </TableRow>
                    ) : (
                        classes.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell className='font-medium'>{c.name}</TableCell>
                                <TableCell>{c._count?.students || 0}</TableCell>
                                <TableCell>
                                    {c.batches?.map(b => b.name).join(', ') || '-'}
                                </TableCell>
                                <TableCell>
                                    {c.sections?.map(s => s.name).join(', ') || '-'}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <div className='flex justify-end gap-2'>
                                        <ClassDialog classItem={c} sessions={sessions} />
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='text-destructive'
                                            onClick={() => handleDelete(c.id)}
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
