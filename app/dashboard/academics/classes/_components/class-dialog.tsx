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
import { createClassAction, updateClassAction } from '@/actions/academics';
import { toast } from 'sonner';
import { IconPlus, IconPencil } from '@tabler/icons-react';

const classSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    sessionId: z.string().min(1, 'Session is required')
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassDialogProps {
    classItem?: {
        id: string;
        name: string;
        sessionId: string;
    };
    sessions: { id: string; year: string }[];
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ClassDialog({ classItem, sessions, trigger, open, onOpenChange }: ClassDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isEdit = !!classItem;

    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange || setInternalOpen;

    const form = useForm<ClassFormValues>({
        resolver: zodResolver(classSchema),
        defaultValues: {
            name: classItem?.name || '',
            sessionId: classItem?.sessionId || (sessions.length > 0 ? sessions[0].id : '')
        }
    });

    const onSubmit = async (data: ClassFormValues) => {
        try {
            let result;
            if (isEdit && classItem) {
                result = await updateClassAction(classItem.id, { name: data.name });
            } else {
                result = await createClassAction(data);
            }

            if (result.success) {
                toast.success(isEdit ? 'Class updated successfully' : 'Class created successfully');
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
                        {isEdit ? <IconPencil className='h-4 w-4' /> : <><IconPlus className='h-4 w-4 mr-2' />Add Class</>}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Class' : 'Create Class'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update class name.'
                            : 'Add a new class to a session.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Class 10' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='sessionId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Session</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isEdit} // Prevent changing session on edit for simplicity
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select session' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sessions.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
