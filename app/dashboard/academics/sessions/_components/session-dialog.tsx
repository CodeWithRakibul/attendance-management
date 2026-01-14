'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { createSessionAction, updateSessionAction } from '@/actions/academics';
import { toast } from 'sonner';
import { IconPlus, IconPencil } from '@tabler/icons-react';

const sessionSchema = z.object({
    year: z.string().min(4, 'Year must be at least 4 characters like 2024 or 2024-2025'),
    status: z.enum(['ACTIVE', 'CLOSED']).optional()
});

type SessionFormValues = z.infer<typeof sessionSchema>;

interface SessionDialogProps {
    session?: {
        id: string;
        year: string;
        status: 'ACTIVE' | 'CLOSED';
    };
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function SessionDialog({ session, trigger, open, onOpenChange }: SessionDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isEdit = !!session;

    // Controlled or uncontrolled open state
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    const form = useForm<SessionFormValues>({
        resolver: zodResolver(sessionSchema),
        defaultValues: {
            year: session?.year || '',
            status: session?.status || 'ACTIVE'
        }
    });

    const onSubmit = async (data: SessionFormValues) => {
        try {
            let result;
            if (isEdit && session) {
                result = await updateSessionAction(session.id, data);
            } else {
                result = await createSessionAction({ year: data.year });
            }

            if (result.success) {
                toast.success(isEdit ? 'Session updated successfully' : 'Session created successfully');
                setIsOpen(false);
                if (!isEdit) form.reset();
            } else {
                toast.error(result.error as string);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant={isEdit ? 'ghost' : 'default'} size={isEdit ? 'icon' : 'sm'}>
                        {isEdit ? <IconPencil className='h-4 w-4' /> : <><IconPlus className='h-4 w-4 mr-2' />Add Session</>}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Session' : 'Create Session'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update session details. Active sessions allow data entry.'
                            : 'Add a new academic session (e.g., 2024).'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='year'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Year / Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='2024-2025' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isEdit && (
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select status' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='ACTIVE'>Active</SelectItem>
                                                <SelectItem value='CLOSED'>Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <Button type='submit' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
