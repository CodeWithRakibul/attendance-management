'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical, IconUser } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { EmployeeTableData } from '@/types/employee';
import Image from 'next/image';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'INACTIVE':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        case 'SUSPENDED':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'TERMINATED':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'ON_LEAVE':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'RESIGNED':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'FULL_TIME':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'PERMANENT':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'PART_TIME':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'CONTRACT':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'INTERN':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'TEMPORARY':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
};

export const createColumns = (
    onEdit?: (employee: EmployeeTableData) => void,
    onViewDetails?: (employee: EmployeeTableData) => void,
    onDelete?: (employee: EmployeeTableData) => void
): ColumnDef<EmployeeTableData>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <div className='flex items-center justify-center'>
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label='Select row'
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'firstName',
        header: 'Employee Name',
        cell: ({ row }) => (
            <div className='flex items-center gap-3'>
                {row.original.image ? (
                    <Image
                        src={row.original.image}
                        alt={`${row.original.firstName} ${row.original.lastName}`}
                        className='h-10 w-10 rounded object-cover'
                        width={10}
                        height={10}
                    />
                ) : (
                    <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                        <IconUser className='h-5 w-5 text-gray-500' />
                    </div>
                )}
                <div>
                    <div className='font-medium text-gray-900'>
                        {row.original.firstName} {row.original.lastName}
                    </div>
                    {row.original.designation && (
                        <div className='text-sm text-gray-500'>{row.original.designation}</div>
                    )}
                </div>
            </div>
        ),
        enableHiding: false
    },
    {
        accessorKey: 'email',
        header: 'Work Email',
        cell: ({ row }) => <span className='text-gray-700'>{row.original.email}</span>
    },
    {
        accessorKey: 'phone',
        header: 'Contact Number',
        cell: ({ row }) => <span className='text-gray-700'>{row.original.phone || 'N/A'}</span>
    },
    {
        accessorKey: 'joiningDate',
        header: 'Joining Date',
        cell: ({ row }) => {
            const date = row.original.joiningDate;
            if (!date) return <span className='text-gray-500'>N/A</span>;

            const formattedDate = new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            return <span className='text-gray-700'>{formattedDate}</span>;
        }
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
            <span className='text-gray-700'>{row.original.type.replace('_', ' ')}</span>
        ),
        filterFn: (row, id, value) => {
            if (!value || !Array.isArray(value) || value.length === 0) {
                return true;
            }
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                {row.original.status}
            </span>
        ),
        filterFn: (row, id, value) => {
            if (!value || !Array.isArray(value) || value.length === 0) {
                return true; // Show all rows when no filter is applied
            }
            return value.includes(row.getValue(id));
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
                        size='icon'
                    >
                        <IconDotsVertical />
                        <span className='sr-only'>Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-32'>
                    <DropdownMenuItem onClick={() => onEdit?.(row.original)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewDetails?.(row.original)}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant='destructive'
                        onClick={() => onDelete?.(row.original)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
];

// Export the default columns for backward compatibility
export const columns = createColumns();
