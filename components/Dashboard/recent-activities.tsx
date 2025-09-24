'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Activity,
    UserPlus,
    DollarSign,
    Users,
    BookOpen,
    CheckCircle,
    FileText,
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivity {
    id: string;
    type:
        | 'student_admission'
        | 'fee_payment'
        | 'attendance_marked'
        | 'teacher_joined'
        | 'exam_created'
        | 'report_generated'
        | 'system_update';
    title: string;
    description: string;
    user: {
        name: string;
        avatar?: string;
        role: string;
    };
    timestamp: Date;
    status: 'success' | 'pending' | 'warning' | 'info';
    metadata?: {
        amount?: number;
        count?: number;
        class?: string;
        subject?: string;
    };
}

// Sample activities data
const sampleActivities: RecentActivity[] = [
    {
        id: '1',
        type: 'student_admission',
        title: 'New Student Admission',
        description: 'Fatima Rahman admitted to Class 9A',
        user: {
            name: 'Admin User',
            avatar: '/avatars/admin.jpg',
            role: 'Admin'
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        status: 'success',
        metadata: {
            class: 'Class 9A'
        }
    },
    {
        id: '2',
        type: 'fee_payment',
        title: 'Fee Payment Received',
        description: 'Monthly fee payment for November 2024',
        user: {
            name: 'Cashier Ahmed',
            avatar: '/avatars/cashier.jpg',
            role: 'Staff'
        },
        timestamp: new Date(Date.now() - 32 * 60 * 1000), // 32 minutes ago
        status: 'success',
        metadata: {
            amount: 3500,
            count: 1
        }
    },
    {
        id: '3',
        type: 'attendance_marked',
        title: 'Attendance Marked',
        description: 'Class 10B attendance completed for today',
        user: {
            name: 'Mr. Karim',
            avatar: '/avatars/teacher1.jpg',
            role: 'Teacher'
        },
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        status: 'success',
        metadata: {
            class: 'Class 10B',
            count: 28
        }
    },
    {
        id: '4',
        type: 'teacher_joined',
        title: 'New Teacher Joined',
        description: 'Ms. Sultana joined as Mathematics teacher',
        user: {
            name: 'HR Manager',
            avatar: '/avatars/hr.jpg',
            role: 'Staff'
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'success',
        metadata: {
            subject: 'Mathematics'
        }
    },
    {
        id: '5',
        type: 'exam_created',
        title: 'Exam Schedule Created',
        description: 'Monthly test schedule for December 2024',
        user: {
            name: 'Academic Head',
            avatar: '/avatars/academic.jpg',
            role: 'Staff'
        },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        status: 'info',
        metadata: {
            count: 7
        }
    },
    {
        id: '6',
        type: 'report_generated',
        title: 'Monthly Report Generated',
        description: 'Attendance report for November 2024',
        user: {
            name: 'System',
            role: 'System'
        },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        status: 'info'
    },
    {
        id: '7',
        type: 'fee_payment',
        title: 'Bulk Fee Collection',
        description: 'Multiple fee payments processed',
        user: {
            name: 'Cashier Ahmed',
            avatar: '/avatars/cashier.jpg',
            role: 'Staff'
        },
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        status: 'success',
        metadata: {
            amount: 45000,
            count: 15
        }
    },
    {
        id: '8',
        type: 'system_update',
        title: 'System Backup Completed',
        description: 'Daily database backup successful',
        user: {
            name: 'System',
            role: 'System'
        },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: 'success'
    }
];

const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
        case 'student_admission':
            return <UserPlus className='h-4 w-4' />;
        case 'fee_payment':
            return <DollarSign className='h-4 w-4' />;
        case 'attendance_marked':
            return <CheckCircle className='h-4 w-4' />;
        case 'teacher_joined':
            return <Users className='h-4 w-4' />;
        case 'exam_created':
            return <BookOpen className='h-4 w-4' />;
        case 'report_generated':
            return <FileText className='h-4 w-4' />;
        case 'system_update':
            return <Settings className='h-4 w-4' />;
        default:
            return <Activity className='h-4 w-4' />;
    }
};

const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
        case 'success':
            return 'text-green-600 bg-green-50 border-green-200';
        case 'pending':
            return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'warning':
            return 'text-orange-600 bg-orange-50 border-orange-200';
        case 'info':
            return 'text-blue-600 bg-blue-50 border-blue-200';
        default:
            return 'text-gray-600 bg-gray-50 border-gray-200';
    }
};

const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export function RecentActivities() {
    const [activities, setActivities] = useState<RecentActivity[]>(sampleActivities);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <Card className='animate-pulse'>
                <CardHeader>
                    <div className='h-5 bg-muted rounded w-32'></div>
                    <div className='h-4 bg-muted rounded w-48'></div>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className='flex items-start gap-3'>
                                <div className='h-10 w-10 bg-muted rounded-full'></div>
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 bg-muted rounded w-3/4'></div>
                                    <div className='h-3 bg-muted rounded w-full'></div>
                                    <div className='h-3 bg-muted rounded w-1/2'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='overflow-hidden'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Activity className='h-5 w-5 text-green-600' />
                    Recent Activities
                </CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className='h-80'>
                    <div className='space-y-4'>
                        {activities.length === 0 ? (
                            <div className='text-center py-8 text-muted-foreground'>
                                <Activity className='h-12 w-12 mx-auto mb-4 opacity-50' />
                                <p>No recent activities</p>
                                <p className='text-sm'>
                                    Activities will appear here as they happen
                                </p>
                            </div>
                        ) : (
                            activities.map((activity, index) => (
                                <div key={activity.id} className='flex items-start gap-3 group'>
                                    {/* Timeline line */}
                                    <div className='relative'>
                                        <div
                                            className={cn(
                                                'flex items-center justify-center w-8 h-8 rounded-full border-2',
                                                getStatusColor(activity.status)
                                            )}
                                        >
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        {index < activities.length - 1 && (
                                            <div className='absolute top-8 left-1/2 transform -translate-x-1/2 w-px h-6 bg-border'></div>
                                        )}
                                    </div>

                                    <div className='flex-1 min-w-0 pb-4'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <h4 className='text-sm font-medium'>
                                                        {activity.title}
                                                    </h4>
                                                    <Badge
                                                        variant='outline'
                                                        className={cn(
                                                            'text-xs',
                                                            getStatusColor(activity.status)
                                                        )}
                                                    >
                                                        {activity.status}
                                                    </Badge>
                                                </div>

                                                <p className='text-sm text-muted-foreground mb-2'>
                                                    {activity.description}
                                                </p>

                                                {/* Metadata */}
                                                {activity.metadata && (
                                                    <div className='flex items-center gap-3 mb-2 text-xs text-muted-foreground'>
                                                        {activity.metadata.amount && (
                                                            <span className='flex items-center gap-1'>
                                                                <DollarSign className='h-3 w-3' />৳
                                                                {activity.metadata.amount.toLocaleString()}
                                                            </span>
                                                        )}
                                                        {activity.metadata.count && (
                                                            <span className='flex items-center gap-1'>
                                                                <Users className='h-3 w-3' />
                                                                {activity.metadata.count}{' '}
                                                                {activity.type === 'fee_payment'
                                                                    ? 'payments'
                                                                    : 'students'}
                                                            </span>
                                                        )}
                                                        {activity.metadata.class && (
                                                            <span className='flex items-center gap-1'>
                                                                <BookOpen className='h-3 w-3' />
                                                                {activity.metadata.class}
                                                            </span>
                                                        )}
                                                        {activity.metadata.subject && (
                                                            <span className='flex items-center gap-1'>
                                                                <BookOpen className='h-3 w-3' />
                                                                {activity.metadata.subject}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* User and timestamp */}
                                                <div className='flex items-center gap-2'>
                                                    <Avatar className='h-6 w-6'>
                                                        <AvatarImage src={activity.user.avatar} />
                                                        <AvatarFallback className='text-xs'>
                                                            {getInitials(activity.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className='text-xs text-muted-foreground'>
                                                        {activity.user.name}
                                                    </span>
                                                    <span className='text-xs text-muted-foreground'>
                                                        •
                                                    </span>
                                                    <span className='text-xs text-muted-foreground'>
                                                        {formatTimeAgo(activity.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                {activities.length > 0 && (
                    <div className='flex items-center justify-between mt-4 pt-4 border-t'>
                        <div className='text-sm text-muted-foreground'>
                            {activities.length} recent activities
                        </div>
                        <Button variant='outline' size='sm'>
                            View All Activities
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
