import React from 'react';
import { DashboardSummaryCards } from '@/components/Dashboard/dashboard-summary-cards';
import { DashboardCharts } from '@/components/Dashboard/dashboard-charts';
import { DashboardNotifications } from '@/components/Dashboard/dashboard-notifications';
import { RecentActivities } from '@/components/Dashboard/recent-activities';

export default function Page() {
    return (
        <div className='flex flex-col gap-6 p-6'>
            {/* Summary Cards */}
            <DashboardSummaryCards />

            {/* Charts Section */}
            <DashboardCharts />

            {/* Bottom Section - Notifications and Recent Activities */}
            <div className='grid gap-6 md:grid-cols-2'>
                <DashboardNotifications />
                <RecentActivities />
            </div>
        </div>
    );
}
