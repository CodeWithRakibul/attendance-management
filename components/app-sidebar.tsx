'use client';

import * as React from 'react';
import {
    IconDashboard,
    IconHelp,
    IconReport,
    IconSearch,
    IconSettings,
    IconUserCheck,
    IconUsers
} from '@tabler/icons-react';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/easy-logo.jpg';

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: IconDashboard
        },
        {
            title: 'Teachers',
            url: '/dashboard/teachers',
            icon: IconUsers
        },
        {
            title: 'Students',
            url: '/dashboard/students',
            icon: IconUsers
        },
        // {
        //     title: 'Shifts',
        //     url: '/dashboard/shifts',
        //     icon: IconClockHour3
        // },
        {
            title: 'Attendance',
            url: '/dashboard/attendance',
            icon: IconUserCheck
        },
        {
            title: 'Reports',
            url: '/dashboard/reports',
            icon: IconReport
        }
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '#',
            icon: IconSettings
        },
        {
            title: 'Get Help',
            url: 'https://www.stackprovider.com',
            icon: IconHelp
        },
        {
            title: 'Search',
            url: '#',
            icon: IconSearch
        }
    ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible='icon' variant='inset' {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className='data-[slot=sidebar-menu-button]:!p-1.5'
                        >
                            <Link
                                href='https://www.stackprovider.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Image src={logo} alt='Stack Provider' width={32} height={32} />
                                <span className='text-lg font-semibold'>
                                    Easy <span className='text-[#6e56cf]'>Coaching</span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className='mt-auto' />
            </SidebarContent>
        </Sidebar>
    );
}
