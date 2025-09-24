'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconCheck, IconX, IconClock, IconDeviceFloppy } from '@tabler/icons-react';
import { getStaffForAttendance, markStaffAttendance } from './actions';
import { toast } from 'sonner';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE';

type StaffForAttendance = {
    id: string;
    teacherId: string;
    personal: {
        nameEn: string;
        nameBn?: string;
        photoUrl?: string;
    };
    designation: string;
    status: AttendanceStatus;
    checkInTime?: string;
    checkOutTime?: string;
};

export function StaffAttendanceForm() {
    const [staff, setStaff] = useState<StaffForAttendance[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadStaff();
    }, [selectedDate]);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const data = await getStaffForAttendance(selectedDate);

            // Initialize with existing attendance or default to PRESENT
            const staffWithStatus = data.map((member: any) => ({
                ...member,
                status: member.attendanceStatus || ('PRESENT' as AttendanceStatus),
                checkInTime: member.checkInTime || '',
                checkOutTime: member.checkOutTime || ''
            }));

            setStaff(staffWithStatus);
        } catch (error) {
            toast.error('Failed to load staff');
        } finally {
            setLoading(false);
        }
    };

    const updateStaffStatus = (staffId: string, status: AttendanceStatus) => {
        setStaff((prev) =>
            prev.map((member) => (member.id === staffId ? { ...member, status } : member))
        );
    };

    const updateCheckTime = (
        staffId: string,
        field: 'checkInTime' | 'checkOutTime',
        time: string
    ) => {
        setStaff((prev) =>
            prev.map((member) => (member.id === staffId ? { ...member, [field]: time } : member))
        );
    };

    const markAllAs = (status: AttendanceStatus) => {
        setStaff((prev) => prev.map((member) => ({ ...member, status })));
    };

    const handleSaveAttendance = async () => {
        setSaving(true);
        try {
            const attendanceData = staff.map((member) => ({
                staffId: member.id,
                date: selectedDate,
                status: member.status,
                checkInTime: member.checkInTime || null,
                checkOutTime: member.checkOutTime || null
            }));

            await markStaffAttendance(attendanceData);
            toast.success('Staff attendance saved successfully');
        } catch (error) {
            toast.error('Failed to save staff attendance');
        } finally {
            setSaving(false);
        }
    };

    const getStatusCounts = () => {
        const present = staff.filter((s) => s.status === 'PRESENT').length;
        const absent = staff.filter((s) => s.status === 'ABSENT').length;
        const leave = staff.filter((s) => s.status === 'LEAVE').length;
        return { present, absent, leave, total: staff.length };
    };

    const counts = getStatusCounts();

    return (
        <div className='space-y-6'>
            {/* Date Selection */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label htmlFor='date'>Date</Label>
                    <Input
                        type='date'
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Summary Cards */}
            {staff.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <Card>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-sm font-medium'>Total Staff</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{counts.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-sm font-medium text-green-600'>
                                Present
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-green-600'>
                                {counts.present}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-sm font-medium text-red-600'>
                                Absent
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-red-600'>{counts.absent}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-sm font-medium text-blue-600'>
                                On Leave
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-blue-600'>{counts.leave}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Bulk Actions */}
            {staff.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                    <Button variant='outline' size='sm' onClick={() => markAllAs('PRESENT')}>
                        <IconCheck className='mr-2 h-4 w-4' />
                        Mark All Present
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => markAllAs('ABSENT')}>
                        <IconX className='mr-2 h-4 w-4' />
                        Mark All Absent
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => markAllAs('LEAVE')}>
                        <IconClock className='mr-2 h-4 w-4' />
                        Mark All Leave
                    </Button>
                    <Button onClick={handleSaveAttendance} disabled={saving} className='ml-auto'>
                        <IconDeviceFloppy className='mr-2 h-4 w-4' />
                        {saving ? 'Saving...' : 'Save Attendance'}
                    </Button>
                </div>
            )}

            {/* Staff List */}
            {loading ? (
                <div className='text-center py-8'>Loading staff...</div>
            ) : staff.length > 0 ? (
                <div className='grid gap-4'>
                    {staff.map((member) => (
                        <Card key={member.id} className='p-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-4'>
                                    <Avatar className='h-10 w-10'>
                                        <AvatarImage
                                            src={member.personal.photoUrl}
                                            alt={member.personal.nameEn}
                                        />
                                        <AvatarFallback>
                                            {member.personal.nameEn
                                                .split(' ')
                                                .map((n) => n.charAt(0))
                                                .join('')
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <div className='font-medium'>{member.personal.nameEn}</div>
                                        {member.personal.nameBn && (
                                            <div className='text-sm text-muted-foreground'>
                                                {member.personal.nameBn}
                                            </div>
                                        )}
                                        <div className='text-sm text-muted-foreground'>
                                            ID: {member.teacherId} • {member.designation}
                                        </div>
                                    </div>
                                </div>

                                <div className='flex items-center space-x-4'>
                                    {/* Check-in/out times */}
                                    <div className='flex space-x-2'>
                                        <div className='space-y-1'>
                                            <Label className='text-xs'>Check In</Label>
                                            <Input
                                                type='time'
                                                value={member.checkInTime}
                                                onChange={(e) =>
                                                    updateCheckTime(
                                                        member.id,
                                                        'checkInTime',
                                                        e.target.value
                                                    )
                                                }
                                                className='w-24 h-8 text-xs'
                                                disabled={member.status !== 'PRESENT'}
                                            />
                                        </div>
                                        <div className='space-y-1'>
                                            <Label className='text-xs'>Check Out</Label>
                                            <Input
                                                type='time'
                                                value={member.checkOutTime}
                                                onChange={(e) =>
                                                    updateCheckTime(
                                                        member.id,
                                                        'checkOutTime',
                                                        e.target.value
                                                    )
                                                }
                                                className='w-24 h-8 text-xs'
                                                disabled={member.status !== 'PRESENT'}
                                            />
                                        </div>
                                    </div>

                                    {/* Status buttons */}
                                    <div className='flex items-center space-x-2'>
                                        <Button
                                            variant={
                                                member.status === 'PRESENT' ? 'default' : 'outline'
                                            }
                                            size='sm'
                                            onClick={() => updateStaffStatus(member.id, 'PRESENT')}
                                        >
                                            <IconCheck className='mr-1 h-4 w-4' />
                                            Present
                                        </Button>

                                        <Button
                                            variant={
                                                member.status === 'LEAVE' ? 'default' : 'outline'
                                            }
                                            size='sm'
                                            onClick={() => updateStaffStatus(member.id, 'LEAVE')}
                                        >
                                            <IconClock className='mr-1 h-4 w-4' />
                                            Leave
                                        </Button>

                                        <Button
                                            variant={
                                                member.status === 'ABSENT'
                                                    ? 'destructive'
                                                    : 'outline'
                                            }
                                            size='sm'
                                            onClick={() => updateStaffStatus(member.id, 'ABSENT')}
                                        >
                                            <IconX className='mr-1 h-4 w-4' />
                                            Absent
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className='text-center py-8 text-muted-foreground'>
                    No staff members found.
                </div>
            )}
        </div>
    );
}
