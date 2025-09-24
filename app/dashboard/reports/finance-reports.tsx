'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, DollarSign, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import {
    getFinanceReportData,
    exportFinanceReport,
    getSessions,
    getClasses,
    getBatches
} from './actions';

interface Session {
    id: string;
    year: string;
    status: string;
}

interface Class {
    id: string;
    name: string;
    sessionId: string;
}

interface Batch {
    id: string;
    name: string;
    classId: string;
}

export function FinanceReports() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any>(null);

    const [filters, setFilters] = useState({
        reportType: 'daily-collection',
        sessionId: '',
        classId: '',
        batchId: '',
        dateFrom: '',
        dateTo: '',
        month: '',
        year: '',
        feeType: '',
        paymentStatus: ''
    });

    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {
        if (filters.sessionId) {
            loadClasses(filters.sessionId);
        }
    }, [filters.sessionId]);

    useEffect(() => {
        if (filters.classId) {
            loadBatches(filters.classId);
        }
    }, [filters.classId]);

    const loadSessions = async () => {
        try {
            const data = await getSessions();
            setSessions(data);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        }
    };

    const loadClasses = async (sessionId: string) => {
        try {
            const data = await getClasses(sessionId);
            setClasses(data);
        } catch (error) {
            console.error('Failed to load classes:', error);
        }
    };

    const loadBatches = async (classId: string) => {
        try {
            const data = await getBatches(classId);
            setBatches(data);
        } catch (error) {
            console.error('Failed to load batches:', error);
        }
    };

    const generateReport = async () => {
        setLoading(true);
        try {
            const data = await getFinanceReportData(filters);
            setReportData(data);
        } catch (error) {
            console.error('Failed to generate report:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
        setLoading(true);
        try {
            await exportFinanceReport(filters, format);
        } catch (error) {
            console.error('Failed to export report:', error);
        } finally {
            setLoading(false);
        }
    };

    const reportTypes = [
        { value: 'daily-collection', label: 'Daily Collection Report' },
        { value: 'monthly-collection', label: 'Monthly Collection Report' },
        { value: 'pending-dues', label: 'Pending Dues Report' },
        { value: 'fee-defaulters', label: 'Fee Defaulters Report' },
        { value: 'collection-vs-expense', label: 'Collection vs Expense' },
        { value: 'fee-type-wise', label: 'Fee Type-wise Collection' },
        { value: 'class-wise-collection', label: 'Class-wise Collection' }
    ];

    const feeTypes = [
        { value: 'NONE', label: 'All Fee Types' },
        { value: 'ADMISSION', label: 'Admission Fee' },
        { value: 'TUITION', label: 'Tuition Fee' },
        { value: 'EXAM', label: 'Exam Fee' },
        { value: 'TRANSPORT', label: 'Transport Fee' },
        { value: 'LIBRARY', label: 'Library Fee' },
        { value: 'LABORATORY', label: 'Laboratory Fee' },
        { value: 'OTHER', label: 'Other Fees' }
    ];

    const paymentStatuses = [
        { value: 'NONE', label: 'All Statuses' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'PARTIAL', label: 'Partial' },
        { value: 'OVERDUE', label: 'Overdue' }
    ];

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className='space-y-6'>
            {/* Report Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <DollarSign className='h-5 w-5' />
                        Finance Report Configuration
                    </CardTitle>
                    <CardDescription>
                        Generate comprehensive financial reports for collections, dues, and expenses
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {/* Report Type */}
                    <div className='grid gap-4 sm:gap-6 md:grid-cols-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='reportType'>Report Type</Label>
                            <Select
                                value={filters.reportType}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, reportType: value })
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select report type' />
                                </SelectTrigger>
                                <SelectContent>
                                    {reportTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='feeType'>Fee Type</Label>
                            <Select
                                value={filters.feeType}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, feeType: value })
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select fee type' />
                                </SelectTrigger>
                                <SelectContent>
                                    {feeTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Academic and Payment Filters */}
                        <div className='space-y-2'>
                            <Label htmlFor='session'>Session</Label>
                            <Select
                                value={filters.sessionId}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, sessionId: value })
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select session' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='ALL_SESSIONS'>All Sessions</SelectItem>
                                    {sessions.map((session) => (
                                        <SelectItem key={session.id} value={session.id}>
                                            {session.year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='class'>Class</Label>
                            <Select
                                value={filters.classId}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, classId: value })
                                }
                                disabled={!filters.sessionId}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select class' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='ALL_CLASSES'>All Classes</SelectItem>
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
                                value={filters.batchId}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, batchId: value })
                                }
                                disabled={!filters.classId}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select batch' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='ALL_BATCHES'>All Batches</SelectItem>
                                    {batches.map((batch) => (
                                        <SelectItem key={batch.id} value={batch.id}>
                                            {batch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='paymentStatus'>Payment Status</Label>
                            <Select
                                value={filters.paymentStatus}
                                onValueChange={(value) =>
                                    setFilters({ ...filters, paymentStatus: value })
                                }
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select status' />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentStatuses.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range Filters */}
                        {(filters.reportType === 'daily-collection' ||
                            filters.reportType === 'collection-vs-expense') && (
                            <>
                                <div className='space-y-2'>
                                    <Label htmlFor='dateFrom'>From Date</Label>
                                    <DatePicker
                                        className='w-full'
                                        date={
                                            filters.dateFrom
                                                ? new Date(filters.dateFrom)
                                                : undefined
                                        }
                                        onDateChange={(date) =>
                                            setFilters({
                                                ...filters,
                                                dateFrom: date?.toISOString().split('T')[0] || ''
                                            })
                                        }
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='dateTo'>To Date</Label>
                                    <DatePicker
                                        className='w-full'
                                        date={filters.dateTo ? new Date(filters.dateTo) : undefined}
                                        onDateChange={(date) =>
                                            setFilters({
                                                ...filters,
                                                dateTo: date?.toISOString().split('T')[0] || ''
                                            })
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Monthly Filters */}
                    {filters.reportType === 'monthly-collection' && (
                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label htmlFor='month'>Month</Label>
                                <Select
                                    value={filters.month}
                                    onValueChange={(value) =>
                                        setFilters({ ...filters, month: value })
                                    }
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select month' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='year'>Year</Label>
                                <Select
                                    value={filters.year}
                                    onValueChange={(value) =>
                                        setFilters({ ...filters, year: value })
                                    }
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select year' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className='flex gap-4 justify-end'>
                        <Button onClick={generateReport} disabled={loading}>
                            <BarChart3 className='h-4 w-4 mr-2' />
                            {loading ? 'Generating...' : 'Generate Report'}
                        </Button>
                        {reportData && (
                            <>
                                <Button
                                    variant='outline'
                                    onClick={() => exportReport('pdf')}
                                    disabled={loading}
                                >
                                    <Download className='h-4 w-4 mr-2' />
                                    Export PDF
                                </Button>
                                <Button
                                    variant='outline'
                                    onClick={() => exportReport('excel')}
                                    disabled={loading}
                                >
                                    <Download className='h-4 w-4 mr-2' />
                                    Export Excel
                                </Button>
                                <Button
                                    variant='outline'
                                    onClick={() => exportReport('csv')}
                                    disabled={loading}
                                >
                                    <Download className='h-4 w-4 mr-2' />
                                    Export CSV
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Report Preview */}
            {reportData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Finance Report Preview</CardTitle>
                        <CardDescription>
                            Preview of the generated financial report data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-6'>
                            {/* Summary Stats */}
                            <div className='grid gap-4 md:grid-cols-4'>
                                <div className='text-center p-4 border rounded-lg'>
                                    <div className='text-2xl font-bold text-green-600'>
                                        ৳
                                        {reportData.summary?.totalCollection?.toLocaleString() || 0}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        Total Collection
                                    </div>
                                </div>
                                <div className='text-center p-4 border rounded-lg'>
                                    <div className='text-2xl font-bold text-red-600'>
                                        ৳{reportData.summary?.totalDues?.toLocaleString() || 0}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        Pending Dues
                                    </div>
                                </div>
                                <div className='text-center p-4 border rounded-lg'>
                                    <div className='text-2xl font-bold text-blue-600'>
                                        ৳{reportData.summary?.totalExpense?.toLocaleString() || 0}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        Total Expense
                                    </div>
                                </div>
                                <div className='text-center p-4 border rounded-lg'>
                                    <div className='text-2xl font-bold text-purple-600'>
                                        ৳{reportData.summary?.netProfit?.toLocaleString() || 0}
                                    </div>
                                    <div className='text-sm text-muted-foreground'>Net Profit</div>
                                </div>
                            </div>

                            {/* Collection vs Expense Chart Placeholder */}
                            {filters.reportType === 'collection-vs-expense' && (
                                <div className='border rounded-lg p-6'>
                                    <h4 className='font-medium mb-4'>
                                        Collection vs Expense Trends
                                    </h4>
                                    <div className='h-64 bg-muted rounded flex items-center justify-center'>
                                        <div className='text-center text-muted-foreground'>
                                            <BarChart3 className='h-12 w-12 mx-auto mb-2' />
                                            <p>
                                                Collection vs Expense chart would be displayed here
                                            </p>
                                            <p className='text-sm'>
                                                Integration with recharts for visualization
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fee Type Distribution */}
                            {filters.reportType === 'fee-type-wise' &&
                                reportData.feeTypeDistribution && (
                                    <div className='border rounded-lg p-6'>
                                        <h4 className='font-medium mb-4'>Fee Type Distribution</h4>
                                        <div className='grid gap-4 md:grid-cols-2'>
                                            <div className='h-64 bg-muted rounded flex items-center justify-center'>
                                                <div className='text-center text-muted-foreground'>
                                                    <PieChart className='h-12 w-12 mx-auto mb-2' />
                                                    <p>
                                                        Fee type pie chart would be displayed here
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='space-y-2'>
                                                {reportData.feeTypeDistribution.map(
                                                    (item: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className='flex justify-between items-center p-3 border rounded'
                                                        >
                                                            <span className='font-medium'>
                                                                {item.feeType}
                                                            </span>
                                                            <div className='text-right'>
                                                                <div className='font-bold'>
                                                                    ৳{item.amount.toLocaleString()}
                                                                </div>
                                                                <div className='text-sm text-muted-foreground'>
                                                                    {item.percentage}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* Sample Data Table */}
                            {reportData.records && reportData.records.length > 0 && (
                                <div className='border rounded-lg overflow-hidden'>
                                    <div className='bg-muted p-4'>
                                        <h4 className='font-medium'>
                                            Sample Financial Records (First 10 records)
                                        </h4>
                                    </div>
                                    <div className='overflow-x-auto'>
                                        <table className='w-full'>
                                            <thead className='bg-muted/50'>
                                                <tr>
                                                    <th className='text-left p-3 border-b'>Date</th>
                                                    <th className='text-left p-3 border-b'>
                                                        Student
                                                    </th>
                                                    <th className='text-left p-3 border-b'>
                                                        Fee Type
                                                    </th>
                                                    <th className='text-left p-3 border-b'>
                                                        Amount
                                                    </th>
                                                    <th className='text-left p-3 border-b'>
                                                        Status
                                                    </th>
                                                    <th className='text-left p-3 border-b'>
                                                        Collected By
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.records
                                                    .slice(0, 10)
                                                    .map((record: any, index: number) => (
                                                        <tr key={index} className='border-b'>
                                                            <td className='p-3'>
                                                                {new Date(
                                                                    record.collectedAt ||
                                                                        record.createdAt
                                                                ).toLocaleDateString()}
                                                            </td>
                                                            <td className='p-3'>
                                                                {record.student?.personal?.nameEn}
                                                            </td>
                                                            <td className='p-3'>
                                                                <Badge variant='outline'>
                                                                    {record.feeMaster?.type}
                                                                </Badge>
                                                            </td>
                                                            <td className='p-3 font-medium'>
                                                                ৳{record.amount?.toLocaleString()}
                                                            </td>
                                                            <td className='p-3'>
                                                                <Badge
                                                                    variant={
                                                                        record.status === 'APPROVED'
                                                                            ? 'default'
                                                                            : record.status ===
                                                                              'PARTIAL'
                                                                            ? 'secondary'
                                                                            : 'destructive'
                                                                    }
                                                                >
                                                                    {record.status}
                                                                </Badge>
                                                            </td>
                                                            <td className='p-3'>
                                                                {record.collectedBy || '-'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {reportData.records.length > 10 && (
                                        <div className='p-3 text-sm text-muted-foreground text-center border-t'>
                                            ... and {reportData.records.length - 10} more records
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Class-wise Collection Summary */}
                            {filters.reportType === 'class-wise-collection' &&
                                reportData.classSummary && (
                                    <div className='border rounded-lg overflow-hidden'>
                                        <div className='bg-muted p-4'>
                                            <h4 className='font-medium'>
                                                Class-wise Collection Summary
                                            </h4>
                                        </div>
                                        <div className='overflow-x-auto'>
                                            <table className='w-full'>
                                                <thead className='bg-muted/50'>
                                                    <tr>
                                                        <th className='text-left p-3 border-b'>
                                                            Class
                                                        </th>
                                                        <th className='text-left p-3 border-b'>
                                                            Total Students
                                                        </th>
                                                        <th className='text-left p-3 border-b'>
                                                            Total Collection
                                                        </th>
                                                        <th className='text-left p-3 border-b'>
                                                            Pending Dues
                                                        </th>
                                                        <th className='text-left p-3 border-b'>
                                                            Collection %
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reportData.classSummary.map(
                                                        (summary: any, index: number) => (
                                                            <tr key={index} className='border-b'>
                                                                <td className='p-3 font-medium'>
                                                                    {summary.className}
                                                                </td>
                                                                <td className='p-3'>
                                                                    {summary.totalStudents}
                                                                </td>
                                                                <td className='p-3 text-green-600 font-medium'>
                                                                    ৳
                                                                    {summary.totalCollection.toLocaleString()}
                                                                </td>
                                                                <td className='p-3 text-red-600 font-medium'>
                                                                    ৳
                                                                    {summary.pendingDues.toLocaleString()}
                                                                </td>
                                                                <td className='p-3'>
                                                                    <Badge
                                                                        variant={
                                                                            summary.collectionPercentage >=
                                                                            80
                                                                                ? 'default'
                                                                                : 'destructive'
                                                                        }
                                                                    >
                                                                        {
                                                                            summary.collectionPercentage
                                                                        }
                                                                        %
                                                                    </Badge>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                            {/* Defaulters List */}
                            {filters.reportType === 'fee-defaulters' && reportData.defaulters && (
                                <div className='border rounded-lg overflow-hidden'>
                                    <div className='bg-muted p-4'>
                                        <h4 className='font-medium'>Fee Defaulters List</h4>
                                    </div>
                                    <div className='overflow-x-auto'>
                                        <table className='w-full'>
                                            <thead className='bg-muted/50'>
                                                <tr>
                                                    <th className='text-left p-3 border-b'>
                                                        Student ID
                                                    </th>
                                                    <th className='text-left p-3 border-b'>Name</th>
                                                    <th className='text-left p-3 border-b'>
                                                        Class
                                                    </th>
                                                    <th className='text-left p-3 border-b'>
                                                        Due Amount
                                                    </th>
                                                    <th className='text-left p-3 border-b'>
                                                        Days Overdue
                                                    </th>
                                                    <th className='text-left p-3 border-b'>
                                                        Guardian Contact
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.defaulters
                                                    .slice(0, 10)
                                                    .map((defaulter: any, index: number) => (
                                                        <tr key={index} className='border-b'>
                                                            <td className='p-3'>
                                                                {defaulter.studentId}
                                                            </td>
                                                            <td className='p-3'>
                                                                {defaulter.personal?.nameEn}
                                                            </td>
                                                            <td className='p-3'>
                                                                {defaulter.class?.name}
                                                            </td>
                                                            <td className='p-3 text-red-600 font-medium'>
                                                                ৳
                                                                {defaulter.dueAmount.toLocaleString()}
                                                            </td>
                                                            <td className='p-3'>
                                                                <Badge variant='destructive'>
                                                                    {defaulter.daysOverdue} days
                                                                </Badge>
                                                            </td>
                                                            <td className='p-3'>
                                                                {defaulter.guardian?.mobile}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {reportData.defaulters.length > 10 && (
                                        <div className='p-3 text-sm text-muted-foreground text-center border-t'>
                                            ... and {reportData.defaulters.length - 10} more
                                            defaulters
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
