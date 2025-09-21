'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { EmployeeFormData, employeeTypeOptions, employeeStatusOptions } from '@/types/employee';

// Enhanced Zod schema for employee form validation
const employeeFormSchema = z.object({
    userId: z.number().min(1, 'User ID is required'),
    firstName: z
        .string()
        .min(1, 'First name is required')
        .max(50, 'First name must be less than 50 characters'),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .max(50, 'Last name must be less than 50 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
        .string()
        .nullable()
        .optional()
        .refine((val) => {
            if (!val || /^\s*$/.test(val)) return true;
            return /^[\+]?[1-9][\d]{0,15}$/.test(val);
        }, 'Please enter a valid phone number'),
    address: z.string().nullable().optional(),
    designation: z.string().nullable().optional(),
    birthDate: z
        .date()
        .nullable()
        .optional()
        .refine((date) => {
            if (!date) return true;
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            return age >= 16 && age <= 100;
        }, 'Age must be between 16 and 100 years'),
    joiningDate: z
        .date()
        .nullable()
        .optional()
        .refine((date) => {
            if (!date) return true;
            const today = new Date();
            return date <= today;
        }, 'Joining date cannot be in the future'),
    type: z.enum(['FULL_TIME', 'PERMANENT', 'INTERN', 'PART_TIME', 'CONTRACT', 'TEMPORARY']),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED', 'ON_LEAVE', 'RESIGNED']),
    image: z.string().nullable().optional(),
    deviceUserId: z.string().nullable().optional()
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
    initialData?: Partial<EmployeeFormData>;
    onSubmit: (data: EmployeeFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
    mode: 'create' | 'edit';
}

export function EmployeeForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    mode
}: EmployeeFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
    const [birthDateOpen, setBirthDateOpen] = useState(false);
    const [joiningDateOpen, setJoiningDateOpen] = useState(false);

    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            userId: initialData?.userId || 1,
            firstName: initialData?.firstName || '',
            lastName: initialData?.lastName || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            address: initialData?.address || '',
            designation: initialData?.designation || '',
            birthDate: initialData?.birthDate,
            joiningDate: initialData?.joiningDate,
            type: initialData?.type || 'FULL_TIME',
            status: initialData?.status || 'ACTIVE',
            image: initialData?.image || '',
            deviceUserId: initialData?.deviceUserId || ''
        }
    });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImagePreview(result);
                form.setValue('image', result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview('');
        form.setValue('image', '');
    };

    async function handleSubmit(values: EmployeeFormValues) {
        try {
            await onSubmit(values as EmployeeFormData);
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Failed to submit form. Please try again.');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                {/* Profile Image */}
                <div className='space-y-2'>
                    <FormLabel>Profile Image</FormLabel>
                    <div className='flex items-center justify-center gap-4'>
                        {imagePreview ? (
                            <div className='relative'>
                                <Image
                                    src={imagePreview}
                                    alt='Profile preview'
                                    width={80}
                                    height={80}
                                    className='rounded object-cover border-2 border-gray-200'
                                />
                                <Button
                                    type='button'
                                    variant='destructive'
                                    size='sm'
                                    className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0'
                                    onClick={removeImage}
                                >
                                    <X className='h-3 w-3' />
                                </Button>
                            </div>
                        ) : (
                            <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300'>
                                <Upload className='h-8 w-8 text-gray-400' />
                            </div>
                        )}
                        <div>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageUpload}
                                className='hidden'
                                id='image-upload'
                            />
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                <Upload className='mr-2 h-4 w-4' />
                                Upload Image
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter first name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter last name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter email address'
                                        type='email'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter phone number'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='designation'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter job designation'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='address'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter address'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Employee Type and Status */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Employee Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select employee type' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {employeeTypeOptions.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
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
                        name='status'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select status' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {employeeStatusOptions.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Enhanced Date Pickers */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='birthDate'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>Birth Date</FormLabel>
                                <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant='outline'
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick birth date</span>
                                                )}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className='w-auto p-0'
                                        align='start'
                                        side='bottom'
                                        sideOffset={4}
                                        avoidCollisions={true}
                                        collisionPadding={8}
                                    >
                                        <Calendar
                                            mode='single'
                                            selected={field.value || undefined}
                                            onSelect={(date) => {
                                                field.onChange(date);
                                                setBirthDateOpen(false); // Auto-close after selection
                                            }}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date('1900-01-01')
                                            }
                                            captionLayout='dropdown'
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='joiningDate'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>Joining Date</FormLabel>
                                <Popover open={joiningDateOpen} onOpenChange={setJoiningDateOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant='outline'
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick joining date</span>
                                                )}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className='w-auto p-0'
                                        align='start'
                                        side='bottom'
                                        sideOffset={4}
                                        avoidCollisions={true}
                                        collisionPadding={8}
                                    >
                                        <Calendar
                                            mode='single'
                                            selected={field.value || undefined}
                                            onSelect={(date) => {
                                                field.onChange(date);
                                                setJoiningDateOpen(false); // Auto-close after selection
                                            }}
                                            disabled={(date) => date > new Date()}
                                            captionLayout='dropdown'
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* <FormField
                    control={form.control}
                    name='deviceUserId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Device User ID</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Enter device user ID (for biometric devices)'
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This ID is used to link the employee with biometric attendance
                                devices.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

                {/* Form Actions */}
                <div className='flex justify-end gap-3 pt-4 border-t'>
                    <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type='submit' disabled={isLoading}>
                        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        {mode === 'create' ? 'Create Employee' : 'Update Employee'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
