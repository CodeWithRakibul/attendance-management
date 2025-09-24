'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Users, Calendar, DollarSign } from 'lucide-react';
import { StudentReports } from './student-reports';
import { AttendanceReports } from './attendance-reports';
import { FinanceReports } from './finance-reports';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('students');

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Reports</h1>
                    <p className='text-muted-foreground'>
                        Generate and export comprehensive reports for students, attendance, and
                        finances
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>
                            Total Reports Generated
                        </CardTitle>
                        <FileText className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>1,234</div>
                        <p className='text-xs text-muted-foreground'>+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Student Reports</CardTitle>
                        <Users className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>456</div>
                        <p className='text-xs text-muted-foreground'>+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Attendance Reports</CardTitle>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>789</div>
                        <p className='text-xs text-muted-foreground'>+8% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Finance Reports</CardTitle>
                        <DollarSign className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>123</div>
                        <p className='text-xs text-muted-foreground'>+15% from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Reports Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='students' className='flex items-center gap-2'>
                        <Users className='h-4 w-4' />
                        Student <span className='hidden sm:block'>Reports</span>
                    </TabsTrigger>
                    <TabsTrigger value='attendance' className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4' />
                        Attendance <span className='hidden sm:block'>Reports</span>
                    </TabsTrigger>
                    <TabsTrigger value='finance' className='flex items-center gap-2'>
                        <DollarSign className='h-4 w-4' />
                        Finance <span className='hidden sm:block'>Reports</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='students' className='space-y-4'>
                    <StudentReports />
                </TabsContent>

                <TabsContent value='attendance' className='space-y-4'>
                    <AttendanceReports />
                </TabsContent>

                <TabsContent value='finance' className='space-y-4'>
                    <FinanceReports />
                </TabsContent>
            </Tabs>

            {/* Recent Reports */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>Your recently generated reports</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {[
                            {
                                id: 1,
                                name: 'Student List - Class 10',
                                type: 'Student',
                                generatedAt: '2024-01-15 10:30 AM',
                                format: 'PDF',
                                status: 'completed'
                            },
                            {
                                id: 2,
                                name: 'Monthly Attendance Summary',
                                type: 'Attendance',
                                generatedAt: '2024-01-15 09:15 AM',
                                format: 'Excel',
                                status: 'completed'
                            },
                            {
                                id: 3,
                                name: 'Fee Collection Report',
                                type: 'Finance',
                                generatedAt: '2024-01-14 04:45 PM',
                                format: 'PDF',
                                status: 'completed'
                            },
                            {
                                id: 4,
                                name: 'Guardian Contact List',
                                type: 'Student',
                                generatedAt: '2024-01-14 02:20 PM',
                                format: 'CSV',
                                status: 'processing'
                            }
                        ].map((report) => (
                            <div
                                key={report.id}
                                className='flex items-center flex-wrap gap-3 justify-between p-4 border rounded-lg'
                            >
                                <div className='flex items-center space-x-4'>
                                    <div className='flex-shrink-0'>
                                        {report.type === 'Student' && (
                                            <Users className='h-5 w-5 text-blue-500' />
                                        )}
                                        {report.type === 'Attendance' && (
                                            <Calendar className='h-5 w-5 text-green-500' />
                                        )}
                                        {report.type === 'Finance' && (
                                            <DollarSign className='h-5 w-5 text-yellow-500' />
                                        )}
                                    </div>
                                    <div>
                                        <p className='font-medium'>{report.name}</p>
                                        <p className='text-sm text-muted-foreground'>
                                            Generated on {report.generatedAt}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <Badge
                                        variant={
                                            report.status === 'completed' ? 'default' : 'secondary'
                                        }
                                    >
                                        {report.status}
                                    </Badge>
                                    <Badge variant='outline'>{report.format}</Badge>
                                    {report.status === 'completed' && (
                                        <Button size='sm' variant='outline'>
                                            <Download className='h-4 w-4 mr-1' />
                                            Download
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
