'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feeMasterSchema, type FeeMasterFormData } from '@/lib/validations'
import { createFeeMasterAction } from '@/actions/fee'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'

interface FeeSetupFormProps {
    sessionId: string
}

export function FeeSetupForm({ sessionId }: FeeSetupFormProps) {
    const form = useForm<FeeMasterFormData>({
        resolver: zodResolver(feeMasterSchema),
        defaultValues: {
            sessionId,
            name: '',
            amount: 0,
            type: 'MONTHLY',
            dueDate: ''
        }
    })

    const onSubmit = async (data: FeeMasterFormData) => {
        const result = await createFeeMasterAction(data)
        if (result.success) {
            toast.success('Fee created successfully')
            form.reset({
                sessionId,
                name: '',
                amount: 0,
                type: 'MONTHLY',
                dueDate: ''
            })
        } else {
            toast.error(result.error || 'Failed to create fee')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fee Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Monthly Fee - Jan" {...field} />
                            </FormControl>
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
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fee Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select fee type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ADMISSION">Admission</SelectItem>
                                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                                    <SelectItem value="EXAM">Exam</SelectItem>
                                    <SelectItem value="TRANSPORT">Transport</SelectItem>
                                    <SelectItem value="LIBRARY">Library</SelectItem>
                                    <SelectItem value="LABORATORY">Laboratory</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Due Date (Optional)</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Fee'}
                </Button>
            </form>
        </Form>
    )
}
