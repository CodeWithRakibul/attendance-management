import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconCalendar, IconUsers, IconUserCheck, IconClock } from '@tabler/icons-react';
import { StudentAttendanceForm } from './_components/student-attendance-form';
import { StaffAttendanceForm } from './_components/staff-attendance-form';
import { AttendanceHistory } from './_components/attendance-history';

export default async function AttendancePage() {
    return (
        <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
            <div className='flex items-center justify-between space-y-2'>
                <h2 className=' text-xl sm:text-3xl font-bold tracking-tight'>Attendance</h2>
                <div className='flex items-center space-x-2'>
                    <Button variant='outline'>
                        <IconCalendar className='mr-2 h-4 w-4' />
                        Today: {new Date().toLocaleDateString()}
                    </Button>
                </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Students</CardTitle>
                        <IconUsers className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>245</div>
                        <p className='text-xs text-muted-foreground'>Enrolled students</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Present Today</CardTitle>
                        <IconUserCheck className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>198</div>
                        <p className='text-xs text-muted-foreground'>80.8% attendance</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Late Arrivals</CardTitle>
                        <IconClock className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>12</div>
                        <p className='text-xs text-muted-foreground'>Students late today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Staff Present</CardTitle>
                        <IconUsers className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>22/24</div>
                        <p className='text-xs text-muted-foreground'>91.7% staff attendance</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue='student' className='space-y-4 mt-6'>
                <TabsList className='flex justify-center items-center w-full'>
                    <TabsTrigger value='student'>
                        Student <span className='hidden sm:block'>Attendance</span>
                    </TabsTrigger>
                    <TabsTrigger value='staff'>
                        Staff <span className='hidden sm:block'>Attendance</span>
                    </TabsTrigger>
                    <TabsTrigger value='history'>
                        {' '}
                        <span className='hidden sm:block'>Attendance</span> History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='student' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Mark Student Attendance</CardTitle>
                            <CardDescription>
                                Select session, class, batch, and date to mark student attendance.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<div>Loading attendance form...</div>}>
                                <StudentAttendanceForm />
                            </Suspense>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='staff' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Mark Staff Attendance</CardTitle>
                            <CardDescription>
                                Mark daily check-in/out or status for teaching and non-teaching
                                staff.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<div>Loading staff attendance form...</div>}>
                                <StaffAttendanceForm />
                            </Suspense>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='history' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance History</CardTitle>
                            <CardDescription>
                                View and filter attendance records by date, batch, and other
                                criteria.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<div>Loading attendance history...</div>}>
                                <AttendanceHistory />
                            </Suspense>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
