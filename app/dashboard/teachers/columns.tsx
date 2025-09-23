'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconEye } from '@tabler/icons-react';

export type Teacher = {
    id: string;
    staffId: string;
    personal: {
        nameEn: string;
        nameBn?: string;
        dob: string;
        gender: string;
        photoUrl?: string;
    };
    contact: {
        mobile: string;
        email?: string;
    };
    designation: string;
    subjects: string[];
    qualification: string;
    salaryInfo: {
        basicSalary: number;
        allowances?: any;
    };
    status: 'ACTIVE' | 'INACTIVE' | 'DISABLED';
    createdAt: string;
};

export const teachersColumns = (): ColumnDef<Teacher>[] => [
    {
        accessorKey: 'personal.photoUrl',
        header: '',
        cell: ({ row }) => {
            const teacher = row.original;
            const name = teacher.personal.nameEn;
            const initials = name
                .split(' ')
                .map((n) => n.charAt(0))
                .join('')
                .toUpperCase();

            return (
                <Avatar className='h-8 w-8'>
                    <AvatarImage src={teacher.personal.photoUrl} alt={name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            );
        }
    },
    {
        accessorKey: 'staffId',
        header: 'Teacher ID',
        cell: ({ row }) => <div className='font-medium'>{row.getValue('staffId')}</div>
    },
    {
        accessorKey: 'personal.nameEn',
        header: 'Name',
        cell: ({ row }) => {
            const teacher = row.original;
            return (
                <div>
                    <div className='font-medium'>{teacher.personal.nameEn}</div>
                    {teacher.personal.nameBn && (
                        <div className='text-sm text-muted-foreground'>
                            {teacher.personal.nameBn}
                        </div>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: 'designation',
        header: 'Designation',
        cell: ({ row }) => <div className='font-medium'>{row.getValue('designation')}</div>
    },
    {
        accessorKey: 'subjects',
        header: 'Subjects',
        cell: ({ row }) => {
            const subjects = row.getValue('subjects') as string[];
            return (
                <div className='flex flex-wrap gap-1'>
                    {subjects.slice(0, 2).map((subject, index) => (
                        <Badge key={index} variant='secondary' className='text-xs'>
                            {subject}
                        </Badge>
                    ))}
                    {subjects.length > 2 && (
                        <Badge variant='outline' className='text-xs'>
                            +{subjects.length - 2}
                        </Badge>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: 'qualification',
        header: 'Qualification',
        cell: ({ row }) => <div className='text-sm'>{row.getValue('qualification')}</div>
    },
    {
        accessorKey: 'contact.mobile',
        header: 'Contact',
        cell: ({ row }) => {
            const teacher = row.original;
            return (
                <div>
                    <div className='font-medium'>{teacher.contact.mobile}</div>
                    {teacher.contact.email && (
                        <div className='text-sm text-muted-foreground'>{teacher.contact.email}</div>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: 'salaryInfo.basicSalary',
        header: 'Salary',
        cell: ({ row }) => {
            const teacher = row.original;
            const basic = teacher.salaryInfo.basicSalary;
            const allowances = teacher.salaryInfo.allowances || {};
            const allowanceTotal = Object.values(allowances).reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
            const total = basic + allowanceTotal;

            return (
                <div>
                    <div className='font-medium'>৳{total.toLocaleString()}</div>
                    <div className='text-sm text-muted-foreground'>
                        Basic: ৳{basic.toLocaleString()}
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge
                    variant={
                        status === 'ACTIVE'
                            ? 'default'
                            : status === 'INACTIVE'
                            ? 'secondary'
                            : 'destructive'
                    }
                >
                    {status}
                </Badge>
            );
        }
    },
    {
        accessorKey: 'createdAt',
        header: 'Joining Date',
        cell: ({ row }) => {
            const date = row.getValue('createdAt') as string;
            return new Date(date).toLocaleDateString();
        }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const teacher = row.original;

            return (
                <Button
                    variant='ghost'
                    className='h-8 w-8 p-0'
                    onClick={() => {
                        // This will need to be handled by the parent component
                        console.log('View teacher:', teacher);
                    }}
                >
                    <span className='sr-only'>View teacher profile</span>
                    <IconEye className='h-4 w-4' />
                </Button>
            );
        }
    }
];
