'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconCheck, IconX, IconClock, IconDeviceFloppy } from '@tabler/icons-react';
import {
    getSessionsAction,
    getClassesAction
} from '@/actions/academics';
import { getBatches } from '@/actions/student';
import { 
    getStudentsForAttendanceAction, 
    markBatchAttendanceAction 
} from '@/actions/attendance';
import { toast } from 'sonner';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

type StudentForAttendance = {
    id: string;
    studentId: string;
    roll: string;
    personal: any; // Using any for Json type to avoid complexity here
    status: AttendanceStatus;
};

export function StudentAttendanceForm() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [students, setStudents] = useState<StudentForAttendance[]>([]);

    const [selectedSession, setSelectedSession] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {
        if (selectedSession) {
            loadClasses(selectedSession);
        }
    }, [selectedSession]);

    useEffect(() => {
        if (selectedClass) {
            loadBatches(selectedClass);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedSession && selectedClass && selectedBatch && selectedDate) {
            loadStudents();
        }
    }, [selectedSession, selectedClass, selectedBatch, selectedDate]);

    const loadSessions = async () => {
        try {
            const data = await getSessionsAction();
            setSessions(data);
            if (data.length === 1) setSelectedSession(data[0].id); // Auto select if only one
        } catch (error) {
            toast.error('Failed to load sessions');
        }
    };

    const loadClasses = async (sessionId: string) => {
        try {
            const data = await getClassesAction(sessionId);
            setClasses(data);
            setSelectedClass('');
            setSelectedBatch('');
        } catch (error) {
            toast.error('Failed to load classes');
        }
    };

    const loadBatches = async (classId: string) => {
        try {
            const data = await getBatches(classId);
            setBatches(data);
            setSelectedBatch('');
        } catch (error) {
            toast.error('Failed to load batches');
        }
    };

    const loadStudents = async () => {
        setLoading(true);
        try {
            const data = await getStudentsForAttendanceAction({
                sessionId: selectedSession,
                classId: selectedClass,
                batchId: selectedBatch,
                date: selectedDate
            });

            // Initialize with existing attendance or default to PRESENT
            const studentsWithStatus = data.map((student: any) => ({
                ...student,
                status: student.attendanceStatus || ('PRESENT' as AttendanceStatus)
            }));

            setStudents(studentsWithStatus);
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const updateStudentStatus = (studentId: string, status: AttendanceStatus) => {
        setStudents((prev) =>
            prev.map((student) => (student.id === studentId ? { ...student, status } : student))
        );
    };

    const markAllAs = (status: AttendanceStatus) => {
        setStudents((prev) => prev.map((student) => ({ ...student, status })));
    };

    const handleSaveAttendance = async () => {
        setSaving(true);
        try {
            const attendanceData = students.map((student) => ({
                studentId: student.id,
                sessionId: selectedSession,
                batchId: selectedBatch,
                date: new Date(selectedDate),
                status: student.status,
                markedBy: 'SYSTEM' // You might want to get the actual user ID here
            }));

            await markBatchAttendanceAction(attendanceData);
            toast.success('Attendance saved successfully');
        } catch (error) {
            toast.error('Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const getStatusCounts = () => {
        const present = students.filter((s) => s.status === 'PRESENT').length;
        const absent = students.filter((s) => s.status === 'ABSENT').length;
        const late = students.filter((s) => s.status === 'LATE').length;
        return { present, absent, late, total: students.length };
    };

    const counts = getStatusCounts();

    return (
        <div className='space-y-6'>
            {/* Selection Form */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='space-y-2'>
                    <Label htmlFor='session'>Session</Label>
                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select session' />
                        </SelectTrigger>
                        <SelectContent>
                            {sessions.map((session) => (
                                <SelectItem key={session.id} value={session.id}>
                                    {session.year} ({session.status})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='class'>Class</Label>
                    <Select
                        value={selectedClass}
                        onValueChange={setSelectedClass}
                        disabled={!selectedSession}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select class' />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='batch'>Batch</Label>
                    <Select
                        value={selectedBatch}
                        onValueChange={setSelectedBatch}
                        disabled={!selectedClass}
                    >
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select batch' />
                        </SelectTrigger>
                        <SelectContent>
                            {batches.map((batch) => (
                                <SelectItem key={batch.id} value={batch.id}>
                                    {batch.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

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
            {students.length > 0 && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <Card>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-sm font-medium'>Total Students</CardTitle>
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
                            <CardTitle className='text-sm font-medium text-yellow-600'>
                                Late
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-yellow-600'>{counts.late}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Bulk Actions */}
            {students.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                    <Button variant='outline' size='sm' onClick={() => markAllAs('PRESENT')}>
                        <IconCheck className='mr-2 h-4 w-4' />
                        Mark All Present
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => markAllAs('ABSENT')}>
                        <IconX className='mr-2 h-4 w-4' />
                        Mark All Absent
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => markAllAs('LATE')}>
                        <IconClock className='mr-2 h-4 w-4' />
                        Mark All Late
                    </Button>
                    <Button onClick={handleSaveAttendance} disabled={saving} className='ml-auto'>
                        <IconDeviceFloppy className='mr-2 h-4 w-4' />
                        {saving ? 'Saving...' : 'Save Attendance'}
                    </Button>
                </div>
            )}

            {/* Students List */}
            {loading ? (
                <div className='text-center py-8'>Loading students...</div>
            ) : students.length > 0 ? (
                <div className='grid gap-4'>
                    {students.map((student) => (
                        <Card key={student.id} className='p-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center space-x-4'>
                                    <Avatar className='h-10 w-10'>
                                        <AvatarImage
                                            src={student.personal.photoUrl}
                                            alt={student.personal.nameEn}
                                        />
                                        <AvatarFallback>
                                            {student.personal.nameEn
                                                .split(' ')
                                                .map((n: string) => n.charAt(0))
                                                .join('')
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <div className='font-medium'>{student.personal.nameEn}</div>
                                        {student.personal.nameBn && (
                                            <div className='text-sm text-muted-foreground'>
                                                {student.personal.nameBn}
                                            </div>
                                        )}
                                        <div className='text-sm text-muted-foreground'>
                                            ID: {student.studentId} • Roll: {student.roll}
                                        </div>
                                    </div>
                                </div>

                                <div className='flex items-center space-x-2'>
                                    <Button
                                        variant={
                                            student.status === 'PRESENT' ? 'default' : 'outline'
                                        }
                                        size='sm'
                                        onClick={() => updateStudentStatus(student.id, 'PRESENT')}
                                    >
                                        <IconCheck className='mr-1 h-4 w-4' />
                                        Present
                                    </Button>

                                    <Button
                                        variant={student.status === 'LATE' ? 'default' : 'outline'}
                                        size='sm'
                                        onClick={() => updateStudentStatus(student.id, 'LATE')}
                                    >
                                        <IconClock className='mr-1 h-4 w-4' />
                                        Late
                                    </Button>

                                    <Button
                                        variant={
                                            student.status === 'ABSENT' ? 'destructive' : 'outline'
                                        }
                                        size='sm'
                                        onClick={() => updateStudentStatus(student.id, 'ABSENT')}
                                    >
                                        <IconX className='mr-1 h-4 w-4' />
                                        Absent
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : selectedSession && selectedClass && selectedBatch ? (
                <div className='text-center py-8 text-muted-foreground'>
                    No students found for the selected criteria.
                </div>
            ) : (
                <div className='text-center py-8 text-muted-foreground'>
                    Please select session, class, batch, and date to load students.
                </div>
            )}
        </div>
    );
}
