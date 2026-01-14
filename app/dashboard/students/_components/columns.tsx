"use client";
import { createSelectionColumn } from "@/components/Table/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StudentTableData } from "@/types";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import StudentTableActions from "./actions";

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

export const columns: ColumnDef<StudentTableData>[] = [
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
        cell: ({ row }) => row.original.class?.name || 'N/A',
        filterFn: 'multiSelect' as any
    },
    {
        id: 'sectionName',
        accessorFn: (row) => row.section?.name || '',
        header: 'Section',
        cell: ({ row }) => row.original.section?.name || 'N/A',
        filterFn: 'multiSelect' as any
    },
    {
        id: 'batchName',
        accessorFn: (row) => row.batch?.name || '',
        header: 'Batch',
        cell: ({ row }) => row.original.batch?.name || 'N/A',
        filterFn: 'multiSelect' as any
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
        },
        filterFn: 'multiSelect' as any
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
        },
        filterFn: 'multiSelect' as any
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const student = row.original;

            return (
                <StudentTableActions student={student} />
            );
        }
    }
];