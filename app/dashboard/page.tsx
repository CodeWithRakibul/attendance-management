import React from 'react';
import { DashboardSummaryCards } from '@/components/Dashboard/dashboard-summary-cards';
import { DashboardCharts } from '@/components/Dashboard/dashboard-charts';
import { DashboardNotifications } from '@/components/Dashboard/dashboard-notifications';
import { RecentActivities } from '@/components/Dashboard/recent-activities';
import {
    getAdmissionTrendsData,
    getCollectionVsExpenseData,
    getTodayAttendanceData,
    getClassWiseAttendanceData
} from '@/queries/charts';

export default async function Page() {
    const [admissionData, financeData, attendanceData, classAttendanceData] = await Promise.all([
        getAdmissionTrendsData(),
        getCollectionVsExpenseData(),
        getTodayAttendanceData(),
        getClassWiseAttendanceData()
    ]);

    return (
        <div className='flex flex-col gap-6'>
            {/* Summary Cards */}
            <DashboardSummaryCards />

            {/* Charts Section */}
            <DashboardCharts
                admissionData={admissionData}
                financeData={financeData}
                attendanceData={attendanceData}
                classAttendanceData={classAttendanceData}
            />

            {/* Bottom Section - Notifications and Recent Activities */}
            <div className='grid gap-6 md:grid-cols-2'>
                <DashboardNotifications />
                <RecentActivities />
            </div>
        </div>
    );
}
