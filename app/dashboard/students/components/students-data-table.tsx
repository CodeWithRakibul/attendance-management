'use client';

import { useState } from 'react';
import {
    deleteStudentAction,
    bulkDeleteStudentsAction,
    updateStudentStatusAction
} from '../actions';
import { toast } from 'sonner';
import { EditStudentDialog } from './edit-student-dialog';
import { StudentDetailsDialog } from './student-details-dialog';
import { DataTable, createSelectionColumn } from '@/components/Table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    IconDotsVertical,
    IconEye,
    IconEdit,
    IconTrash,
    IconPhone,
    IconMail,
    IconDownload
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { format, isValid } from 'date-fns';
import { StudentTableData } from '@/types';
import { useRouter } from 'next/navigation';

interface StudentsDataTableProps {
    students: StudentTableData[];
    sessions: Array<{ id: string; year: string }>;
    classes: Array<{ id: string; name: string }>;
    batches: Array<{ id: string; name: string }>;
    sections: Array<{ id: string; name: string }>;
}

export function StudentsDataTable({
    students,
    sessions,
    classes,
    batches,
    sections
}: StudentsDataTableProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [editStudent, setEditStudent] = useState<StudentTableData | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewStudent, setViewStudent] = useState<StudentTableData | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const { push } = useRouter();

    const handleDelete = async (studentId: string) => {
        setIsLoading(true);
        try {
            const result = await deleteStudentAction(studentId);
            if (result.success) {
                toast.success('Student deleted successfully');
            } else {
                toast.error(result.error || 'Failed to delete student');
            }
        } catch (error) {
            toast.error('Failed to delete student');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkDelete = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;

        setIsLoading(true);
        try {
            const result = await bulkDeleteStudentsAction(selectedIds);
            if (result.success) {
                toast.success(`${selectedIds.length} students deleted successfully`);
            } else {
                toast.error(result.error || 'Failed to delete students');
            }
        } catch (error) {
            toast.error('Failed to delete students');
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

    const handleExportSelected = (selectedIds: string[]) => {
        const selectedStudentData = students.filter((student) => selectedIds.includes(student.id));
        const csvContent = generateCSV(selectedStudentData);
        downloadCSV(csvContent, 'selected-students.csv');
    };

    const handleExportAll = () => {
        const csvContent = generateCSV(students);
        downloadCSV(csvContent, 'all-students.csv');
    };

    const generateCSV = (data: StudentTableData[]) => {
        const headers = [
            'ID',
            'Name (English)',
            'Name (Bengali)',
            'Class',
            'Section',
            'Batch',
            'Phone',
            'Email',
            'Status',
            'Admission Date'
        ];
        const rows = data.map((student) => {
            const personal = student.personal as any;
            const guardian = student.guardian as any;
            const contact = guardian?.contact || {};

            return [
                student.studentId,
                personal?.nameEn || '',
                personal?.nameBn || '',
                student.class?.name || '',
                student.section?.name || '',
                student.batch?.name || '',
                contact?.smsNo || '',
                contact?.email || '',
                student.status,
                student.createdAt ? format(new Date(student.createdAt), 'dd/MM/yyyy') : ''
            ];
        });

        return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'INACTIVE':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            case 'DISABLED':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Invalid Date';
        } catch {
            return 'Invalid Date';
        }
    };

    const columns: ColumnDef<StudentTableData>[] = [
        createSelectionColumn<StudentTableData>(),
        {
            accessorKey: 'studentId',
            header: 'Student ID',
            cell: ({ row }) => <div className='font-medium'>{row.original.studentId}</div>
        },
        {
            id: 'nameEn',
            accessorFn: (row) => {
                const personal = row.personal as any;
                return personal?.nameEn || '';
            },
            header: 'Name (English)',
            cell: ({ row }) => {
                const personal = row.original.personal as any;
                return (
                    <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src={personal?.photo} alt={personal?.nameEn} />
                            <AvatarFallback>{personal?.nameEn?.charAt(0) || 'S'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className='font-medium'>{personal?.nameEn || 'N/A'}</div>
                            <div className='text-sm text-muted-foreground'>
                                {personal?.nameBn || ''}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            id: 'className',
            accessorFn: (row) => row.class?.name || '',
            header: 'Class',
            cell: ({ row }) => row.original.class?.name || 'N/A'
        },
        {
            id: 'sectionName',
            accessorFn: (row) => row.section?.name || '',
            header: 'Section',
            cell: ({ row }) => row.original.section?.name || 'N/A'
        },
        {
            id: 'batchName',
            accessorFn: (row) => row.batch?.name || '',
            header: 'Batch',
            cell: ({ row }) => row.original.batch?.name || 'N/A'
        },
        {
            id: 'gender',
            accessorFn: (row) => {
                const personal = row.personal as any;
                return personal?.gender || '';
            },
            header: 'Gender',
            cell: ({ row }) => {
                const personal = row.original.personal as any;
                return personal?.gender || 'N/A';
            }
        },
        {
            id: 'fatherName',
            accessorFn: (row) => {
                const guardian = row.guardian as any;
                return guardian?.fatherName || '';
            },
            header: "Father's Name",
            cell: ({ row }) => {
                const guardian = row.original.guardian as any;
                return guardian?.fatherName || 'N/A';
            }
        },
        {
            id: 'contact',
            accessorFn: (row) => {
                const guardian = row.guardian as any;
                const contact = guardian?.contact || {};
                return contact?.smsNo || contact?.email || '';
            },
            header: 'Contact',
            cell: ({ row }) => {
                const guardian = row.original.guardian as any;
                const contact = guardian?.contact || {};
                const phone = contact?.smsNo;
                const email = contact?.email;

                return (
                    <div className='space-y-1'>
                        {phone && (
                            <div className='flex items-center gap-1 text-sm'>
                                <IconPhone className='h-3 w-3' />
                                {phone}
                            </div>
                        )}
                        {email && (
                            <div className='flex items-center gap-1 text-sm'>
                                <IconMail className='h-3 w-3' />
                                {email}
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Admission Date',
            cell: ({ row }) => {
                return formatDate(row.original.createdAt?.toString() || null);
            }
        },
        {
            id: 'dateOfBirth',
            accessorFn: (row) => {
                const personal = row.personal as any;
                return personal?.dob || '';
            },
            header: 'Date of Birth',
            cell: ({ row }) => {
                const personal = row.original.personal as any;
                return formatDate(personal?.dob);
            }
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                return <Badge className={getStatusColor(status)}>{status}</Badge>;
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const student = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <IconDotsVertical className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => push(`/dashboard/students/${student.id}`)}
                            >
                                <IconEye className='mr-2 h-4 w-4' />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => push(`/dashboard/students/${student.id}/edit`)}
                            >
                                <IconEdit className='mr-2 h-4 w-4' />
                                Edit
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
                                onClick={() => handleDelete(student.id)}
                                className='text-red-600'
                            >
                                <IconTrash className='mr-2 h-4 w-4' />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    // Filter options for the data table
    const filters = [
        {
            columnId: 'className',
            title: 'Class',
            options: classes.map((cls) => ({ label: cls.name, value: cls.name }))
        },
        {
            columnId: 'sectionName',
            title: 'Section',
            options: sections.map((section) => ({ label: section.name, value: section.name }))
        },
        {
            columnId: 'batchName',
            title: 'Batch',
            options: batches.map((batch) => ({ label: batch.name, value: batch.name }))
        },
        {
            columnId: 'status',
            title: 'Status',
            options: [
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
                { label: 'Disabled', value: 'DISABLED' }
            ]
        },
        {
            columnId: 'gender',
            title: 'Gender',
            options: [
                { label: 'Male', value: 'MALE' },
                { label: 'Female', value: 'FEMALE' },
                { label: 'Other', value: 'OTHER' }
            ]
        }
    ];

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                <CardTitle>Students</CardTitle>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={handleExportAll}
                        className='flex items-center gap-2'
                    >
                        <IconDownload className='h-4 w-4' />
                        Export All
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    data={students}
                    columns={columns}
                    enableRowSelection={true}
                    enableSearch={true}
                    searchPlaceholder='Search students...'
                    enablePagination={true}
                    pageSize={10}
                    getRowId={(row) => row.id}
                    onDeleteSelected={handleBulkDelete}
                    showDeleteButton={true}
                    deleteButtonLabel='Delete Selected'
                    filters={filters}
                />
            </CardContent>

            {/* Dialogs */}
            <EditStudentDialog
                student={editStudent}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                sessions={sessions}
                classes={classes}
                batches={batches}
                sections={sections}
            />

            <StudentDetailsDialog
                student={viewStudent}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
            />
        </Card>
    );
}
