import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    IconUsers,
    IconUserCheck,
    IconUserPlus,
    IconCreditCard,
    IconTrendingUp,
    IconTrendingDown
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

interface StudentsStatsProps {
    totalStudents: number;
    activeStudents: number;
    newAdmissions: number;
    pendingFees: number;
    previousMonthAdmissions?: number;
}

export function StudentsStats({
    totalStudents,
    activeStudents,
    newAdmissions,
    pendingFees,
    previousMonthAdmissions = 0
}: StudentsStatsProps) {
    // Ensure all values are valid numbers
    const safeNewAdmissions = Number(newAdmissions) || 0;
    const safePreviousMonthAdmissions = Number(previousMonthAdmissions) || 0;
    const safeTotalStudents = Number(totalStudents) || 0;
    const safeActiveStudents = Number(activeStudents) || 0;
    const safePendingFees = Number(pendingFees) || 0;

    const admissionTrend = safeNewAdmissions - safePreviousMonthAdmissions;
    const activePercentage =
        safeTotalStudents > 0 ? Math.round((safeActiveStudents / safeTotalStudents) * 100) : 0;

    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card className='!gap-2'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                    <CardTitle className='text-sm font-medium'>Total Students</CardTitle>
                    <IconUsers className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{safeTotalStudents}</div>
                    <p className='text-xs text-muted-foreground mt-1'>Registered students</p>
                </CardContent>
            </Card>

            <Card className='!gap-2'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                    <CardTitle className='text-sm font-medium'>Active Students</CardTitle>
                    <IconUserCheck className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='flex items-center gap-2'>
                        <div className='text-2xl font-bold'>{safeActiveStudents}</div>
                        <Badge variant='secondary' className='text-xs'>
                            {activePercentage}%
                        </Badge>
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>Currently enrolled</p>
                </CardContent>
            </Card>

            <Card className=' !gap-2'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                    <CardTitle className='text-sm font-medium'>New Admissions</CardTitle>
                    <IconUserPlus className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='flex items-center gap-2'>
                        <div className='text-2xl font-bold'>{safeNewAdmissions}</div>
                        {admissionTrend !== 0 && (
                            <div
                                className={`flex items-center gap-1 ${
                                    admissionTrend > 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {admissionTrend > 0 ? (
                                    <IconTrendingUp className='h-3 w-3' />
                                ) : (
                                    <IconTrendingDown className='h-3 w-3' />
                                )}
                                <span className='text-xs font-medium'>
                                    {Math.abs(admissionTrend)}
                                </span>
                            </div>
                        )}
                    </div>
                    <p className='text-xs text-muted-foreground mt-1'>This month</p>
                </CardContent>
            </Card>

            <Card className='!gap-2'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                    <CardTitle className='text-sm font-medium'>Pending Fees</CardTitle>
                    <IconCreditCard className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{safePendingFees}</div>
                    <p className='text-xs text-muted-foreground mt-1'>Students with dues</p>
                </CardContent>
            </Card>
        </div>
    );
}
