'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteFeeMasterAction } from '@/actions/fee'
import { toast } from 'sonner'
import { format } from 'date-fns'

export type FeeMaster = {
    id: string
    name: string
    amount: number
    type: string
    dueDate: Date | null
    createdAt: Date
}

export const columns: ColumnDef<FeeMaster>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'type',
        header: 'Type',
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
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: ({ row }) => {
            const date = row.getValue('dueDate') as Date | null
            return date ? format(new Date(date), 'PP') : '-'
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const fee = row.original

            const handleDelete = async () => {
                if (confirm('Are you sure you want to delete this fee?')) {
                    const result = await deleteFeeMasterAction(fee.id)
                    if (result.success) {
                        toast.success('Fee deleted successfully')
                    } else {
                        toast.error('Failed to delete fee')
                    }
                }
            }

            return (
                <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                </Button>
            )
        },
    },
]

interface FeeMasterListProps {
    data: any[] // Using any[] to avoid strict type mismatch with Prisma return type for now, or cast it.
}

export function FeeMasterList({ data }: FeeMasterListProps) {
    return <DataTable columns={columns} data={data} searchKey="name" />
}
