'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feeCollectionSchema, type FeeCollectionFormData } from '@/lib/validations'
import { collectFeeAction } from '@/actions/fee'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'

interface StudentFeePaymentProps {
    student: any
    feeMasters: any[]
    collections: any[]
    sessionId: string
}

export function StudentFeePayment({ student, feeMasters, collections, sessionId }: StudentFeePaymentProps) {
    const form = useForm<FeeCollectionFormData>({
        resolver: zodResolver(feeCollectionSchema),
        defaultValues: {
            studentId: student.id,
            sessionId: sessionId,
            feeMasterId: '',
            amount: 0,
            method: 'CASH',
            receiptNo: ''
        }
    })

    const onFeeTypeChange = (feeMasterId: string) => {
        const fee = feeMasters.find(f => f.id === feeMasterId)
        if (fee) {
            form.setValue('feeMasterId', feeMasterId)
            form.setValue('amount', fee.amount)
        }
    }

    const onSubmit = async (data: FeeCollectionFormData) => {
        const result = await collectFeeAction(data)
        if (result.success) {
            toast.success('Fee collected successfully (Pending Approval)')
            form.reset({
                studentId: student.id,
                sessionId: sessionId,
                feeMasterId: '',
                amount: 0,
                method: 'CASH',
                receiptNo: ''
            })
        } else {
            toast.error(result.error || 'Failed to collect fee')
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</Badge>
            case 'REJECTED':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
            default:
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Student Info & Payment Form */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Student Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Name</p>
                                <p className="font-medium">{student.personal.nameEn}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">ID</p>
                                <p className="font-medium">{student.studentId}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Class</p>
                                <p className="font-medium">{student.class?.name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Roll</p>
                                <p className="font-medium">{student.roll}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Collect Fee</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="feeMasterId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fee Type</FormLabel>
                                            <Select onValueChange={onFeeTypeChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select fee type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {feeMasters.map((fee) => (
                                                        <SelectItem key={fee.id} value={fee.id}>
                                                            {fee.name} ({fee.amount})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="method"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CASH">Cash</SelectItem>
                                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                                    <SelectItem value="MOBILE_BANKING">Mobile Banking</SelectItem>
                                                    <SelectItem value="CARD">Card</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="receiptNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Receipt No (Optional)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? 'Processing...' : 'Collect Fee'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            {/* Payment History */}
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {collections.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No payment history found.</p>
                        ) : (
                            collections.map((collection) => (
                                <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <p className="font-medium">{collection.feeMaster.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(collection.createdAt), 'PP p')}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Method: {collection.method}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="font-bold">{collection.amount} BDT</p>
                                        {getStatusBadge(collection.status)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
