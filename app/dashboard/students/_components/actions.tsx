"use client";

import { deleteStudentAction } from '@/actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Student } from '@prisma/client';
import { IconDotsVertical, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { updateStudentStatusAction } from '../actions';
import { AlertModal } from '@/components/alert-modal';

export default function StudentTableActions({ student }: { student: Student }) {
    const [isLoading, setIsLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = async (studentId: string) => {
        setIsLoading(true);
        try {
            const result = await deleteStudentAction(studentId);
            if (result.success) {
                toast.success('Student deleted successfully');
                setDeleteOpen(false)
            } else {
                toast.error(result.error || 'Failed to delete student');
            }
        } catch (error) {
            toast.error('Failed to delete student');
        } finally {
            setIsLoading(false);
        }
    };


    const handleStatusUpdate = async (
        studentId: string,
        status: 'ACTIVE' | 'INACTIVE' | 'DISABLED'
    ) => {
        setIsLoading(true);
        try {
            const result = await updateStudentStatusAction(studentId, status);
            if (result.success) {
                toast.success('Student status updated successfully');
            } else {
                toast.error(result.error || 'Failed to update student status');
            }
        } catch (error) {
            toast.error('Failed to update student status');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <IconDotsVertical className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                        asChild
                    >
                        <Link href={`/dashboard/students/${student.id}`}>
                            <IconEye className='size-4' />
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        asChild
                    >
                        <Link href={`/dashboard/students/${student.id}/edit`}>
                            <IconEdit className='size-4' />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => handleStatusUpdate(student.id, 'ACTIVE')}
                        disabled={student.status === 'ACTIVE'}
                    >
                        Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleStatusUpdate(student.id, 'INACTIVE')}
                        disabled={student.status === 'INACTIVE'}
                    >
                        Set Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleStatusUpdate(student.id, 'DISABLED')}
                        disabled={student.status === 'DISABLED'}
                    >
                        Set Disabled
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className='text-destructive'
                    >
                        <IconTrash className='size-4 text-destructive' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertModal
                description='This action cannot be undone. This will permanently delete the student and all associated data.'
                loading={isLoading}
                isOpen={deleteOpen}
                confirmLabel='Delete'
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => handleDelete(student.id)}
            />
        </>
    )
}
