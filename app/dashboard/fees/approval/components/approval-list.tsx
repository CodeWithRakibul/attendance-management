'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { approveCollectionAction, rejectCollectionAction } from '@/actions/fee'
import { toast } from 'sonner'
import { format } from 'date-fns'

export type PendingCollection = {
    id: string
    amount: number
    method: string
    createdAt: Date
    student: {
        personal: {
            nameEn: string
        }
        studentId: string
        roll: string
        class: {
            name: string
        }
    }
    feeMaster: {
        name: string
        type: string
    }
    collector: {
        personal: {
            nameEn: string
        }
    }
}

export const columns: ColumnDef<PendingCollection>[] = [
    {
        accessorKey: 'student.personal.nameEn',
        header: 'Student Name',
    },
    {
        accessorKey: 'student.studentId',
        header: 'ID',
    },
    {
        accessorKey: 'feeMaster.name',
        header: 'Fee Type',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'))
            return <div className="font-medium">{amount.toFixed(2)}</div>
        },
    },
    {
        accessorKey: 'method',
        header: 'Method',
    },
    {
        accessorKey: 'collector.personal.nameEn',
        header: 'Collected By',
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => {
            return format(new Date(row.getValue('createdAt')), 'PP p')
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const collection = row.original

            const handleApprove = async () => {
                const result = await approveCollectionAction(collection.id)
                if (result.success) {
                    toast.success('Collection approved')
                } else {
                    toast.error('Failed to approve collection')
                }
            }

            const handleReject = async () => {
                if (confirm('Are you sure you want to reject this collection?')) {
                    const result = await rejectCollectionAction(collection.id)
                    if (result.success) {
                        toast.success('Collection rejected')
                    } else {
                        toast.error('Failed to reject collection')
                    }
                }
            }

            return (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleApprove} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                        <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReject} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                </div>
            )
        },
    },
]

interface ApprovalListProps {
    data: any[]
}

export function ApprovalList({ data }: ApprovalListProps) {
    return <DataTable columns={columns} data={data} searchKey="student.personal.nameEn" searchPlaceholder="Search by student name..." />
}
