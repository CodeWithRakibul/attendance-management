'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, Mail, Phone, User, Clock, MapPin, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { EmployeeWithRelations } from '@/types/employee';

interface EmployeeDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    employee: EmployeeWithRelations | null;
}

export function EmployeeDetailsDialog({ isOpen, onClose, employee }: EmployeeDetailsDialogProps) {
    if (!employee) return null;

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
            case 'SUSPENDED':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'TERMINATED':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'ON_LEAVE':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'RESIGNED':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'FULL_TIME':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'PART_TIME':
                return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
            case 'CONTRACT':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
            case 'INTERN':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'TEMPORARY':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'PERMANENT':
                return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className='!max-w-7xl !w-[95vw] max-h-[95vh] overflow-y-auto sm:!max-w-7xl md:!max-w-7xl lg:!max-w-7xl xl:!max-w-7xl'>
                <DialogHeader>
                    <DialogTitle>Employee Details</DialogTitle>
                </DialogHeader>

                <div className='space-y-6'>
                    {/* Header Section */}
                    <div className='flex items-center space-x-4 p-6 border rounded-lg'>
                        <Avatar className='h-16 w-16'>
                            <AvatarImage
                                src={employee.image || undefined}
                                alt={`${employee.firstName} ${employee.lastName}`}
                            />
                            <AvatarFallback>
                                {employee.firstName.charAt(0)}
                                {employee.lastName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <h2 className='text-2xl font-semibold'>
                                {employee.firstName} {employee.lastName}
                            </h2>
                            <p className='text-muted-foreground'>
                                {employee.designation || 'No designation specified'}
                            </p>
                            <div className='flex items-center space-x-2 mt-2'>
                                <Badge variant='outline'>
                                    ID: {employee.deviceUserId || 'Not assigned'}
                                </Badge>
                                <Badge className={getStatusColor(employee.status)}>
                                    {employee.status.replace('_', ' ')}
                                </Badge>
                                <Badge className={getTypeColor(employee.type)}>
                                    {employee.type.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Phone className='h-5 w-5' />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-center space-x-3'>
                                    <Phone className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Phone</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {employee.phone || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <Mail className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Email</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {employee.email || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <MapPin className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Address</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {(employee as any).address || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Employment Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <CalendarDays className='h-5 w-5' />
                                    Employment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-center space-x-3'>
                                    <CalendarDays className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Birth Date</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {employee.birthDate
                                                ? formatDate(employee.birthDate)
                                                : 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <CalendarDays className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Joining Date</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {employee.joiningDate
                                                ? formatDate(employee.joiningDate)
                                                : 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <CalendarDays className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Created Date</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {formatDate(employee.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <User className='h-5 w-5' />
                                    User Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-center space-x-3'>
                                    <User className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Device User ID</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {employee.deviceUserId || 'Not assigned'}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <CheckCircle className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Account Status</p>
                                        <Badge className={getStatusColor(employee.status)}>
                                            {employee.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <User className='h-4 w-4 text-muted-foreground' />
                                    <div>
                                        <p className='text-sm font-medium'>Employee Type</p>
                                        <Badge className={getTypeColor(employee.type)}>
                                            {employee.type.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Assigned Shifts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Clock className='h-5 w-5' />
                                Assigned Shifts
                                <Badge variant='outline' className='ml-auto'>
                                    {employee.employeeShifts?.length || 0} shifts
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {employee.employeeShifts && employee.employeeShifts.length > 0 ? (
                                <div className='space-y-4'>
                                    {employee.employeeShifts.map((employeeShift, index) => (
                                        <div
                                            key={`${employee.id}-shift-${index}`}
                                            className='p-4 border rounded-lg'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center space-x-3'>
                                                    <Clock className='h-4 w-4 text-muted-foreground' />
                                                    <div>
                                                        <h4 className='font-medium'>
                                                            {employeeShift.shift.name}
                                                        </h4>
                                                        <p className='text-sm text-muted-foreground'>
                                                            {format(
                                                                new Date(
                                                                    `2000-01-01T${employeeShift.shift.checkInTime}`
                                                                ),
                                                                'h:mm a'
                                                            )}{' '}
                                                            -{' '}
                                                            {format(
                                                                new Date(
                                                                    `2000-01-01T${employeeShift.shift.checkOutTime}`
                                                                ),
                                                                'h:mm a'
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant='outline'>Active</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center py-8'>
                                    <Clock className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                                    <p className='text-muted-foreground'>No shifts assigned</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* User Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center space-x-2'>
                                <User className='h-5 w-5' />
                                <span>User Account</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <p className='text-sm text-gray-500'>Name</p>
                                    <p className='font-medium'>{employee.user.name}</p>
                                </div>

                                <div>
                                    <p className='text-sm text-gray-500'>Email</p>
                                    <p className='font-medium'>{employee.user.email}</p>
                                </div>

                                <div>
                                    <p className='text-sm text-gray-500'>Account Created</p>
                                    <p className='font-medium'>
                                        {formatDate(employee.user.createdAt)}
                                    </p>
                                </div>

                                <div>
                                    <p className='text-sm text-gray-500'>Last Updated</p>
                                    <p className='font-medium'>
                                        {formatDate(employee.user.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
