'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Bell,
    AlertTriangle,
    DollarSign,
    Calendar,
    Users,
    Clock,
    X,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: 'fee_due' | 'attendance_low' | 'leave_request' | 'birthday' | 'exam_reminder' | 'system';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    timestamp: Date;
    isRead: boolean;
    actionRequired?: boolean;
    relatedId?: string;
}

// Sample notifications data
const sampleNotifications: Notification[] = [
    {
        id: '1',
        type: 'fee_due',
        title: 'Fee Payment Overdue',
        message: '15 students have pending fee payments for November 2024',
        priority: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        actionRequired: true
    },
    {
        id: '2',
        type: 'leave_request',
        title: 'Leave Request Pending',
        message: 'Mr. Rahman has requested leave for December 15-20, 2024',
        priority: 'medium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: false,
        actionRequired: true,
        relatedId: 'teacher_123'
    },
    {
        id: '3',
        type: 'attendance_low',
        title: 'Low Attendance Alert',
        message: 'Class 9A attendance dropped to 72% this week',
        priority: 'medium',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: false
    },
    {
        id: '4',
        type: 'birthday',
        title: 'Birthday Reminder',
        message: '3 students have birthdays today',
        priority: 'low',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        isRead: true
    },
    {
        id: '5',
        type: 'exam_reminder',
        title: 'Exam Schedule',
        message: 'Monthly test for Class 10 starts tomorrow',
        priority: 'medium',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isRead: true
    },
    {
        id: '6',
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Sunday 2 AM - 4 AM',
        priority: 'low',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: true
    }
];

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'fee_due':
            return <DollarSign className='h-4 w-4' />;
        case 'attendance_low':
            return <Users className='h-4 w-4' />;
        case 'leave_request':
            return <Calendar className='h-4 w-4' />;
        case 'birthday':
            return <Users className='h-4 w-4' />;
        case 'exam_reminder':
            return <Clock className='h-4 w-4' />;
        case 'system':
            return <Info className='h-4 w-4' />;
        default:
            return <Bell className='h-4 w-4' />;
    }
};

const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
        case 'high':
            return 'text-red-600 bg-red-50 border-red-200';
        case 'medium':
            return 'text-orange-600 bg-orange-50 border-orange-200';
        case 'low':
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

export function DashboardNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id ? { ...notification, isRead: true } : notification
            )
        );
    };

    const dismissNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const highPriorityCount = notifications.filter(
        (n) => n.priority === 'high' && !n.isRead
    ).length;

    if (loading) {
        return (
            <Card className='animate-pulse'>
                <CardHeader>
                    <div className='h-5 bg-muted rounded sm:w-32'></div>
                    <div className='h-4 bg-muted rounded sm:w-48'></div>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className='flex items-start gap-3 p-3 rounded-lg border'>
                                <div className='h-8 w-8 bg-muted rounded-full'></div>
                                <div className='flex-1 space-y-2'>
                                    <div className='h-4 bg-muted rounded w-3/4'></div>
                                    <div className='h-3 bg-muted rounded w-full'></div>
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
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle className='flex items-center gap-2'>
                            <Bell className='h-5 w-5 text-blue-600' />
                            Notifications
                            {unreadCount > 0 && (
                                <Badge variant='destructive' className='ml-2'>
                                    {unreadCount}
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Recent alerts and important notices
                            {highPriorityCount > 0 && (
                                <span className='text-red-600 font-medium ml-2'>
                                    • {highPriorityCount} high priority
                                </span>
                            )}
                        </CardDescription>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={markAllAsRead}
                            className='text-xs'
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className='h-80'>
                    <div className='space-y-3'>
                        {notifications.length === 0 ? (
                            <div className='text-center py-8 text-muted-foreground'>
                                <Bell className='h-12 w-12 mx-auto mb-4 opacity-50' />
                                <p>No notifications at the moment</p>
                                <p className='text-sm'>You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                                        !notification.isRead
                                            ? 'bg-blue-50/50 border-blue-200'
                                            : 'bg-muted/30 border-muted',
                                        'hover:bg-muted/50 cursor-pointer'
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div
                                        className={cn(
                                            'flex items-center justify-center w-8 h-8 rounded-full',
                                            getPriorityColor(notification.priority)
                                        )}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <div className='flex-1'>
                                                <h4
                                                    className={cn(
                                                        'text-sm font-medium',
                                                        !notification.isRead && 'font-semibold'
                                                    )}
                                                >
                                                    {notification.title}
                                                </h4>
                                                <p className='text-sm text-muted-foreground mt-1'>
                                                    {notification.message}
                                                </p>
                                                <div className='flex items-center gap-2 mt-2'>
                                                    <span className='text-xs text-muted-foreground'>
                                                        {formatTimeAgo(notification.timestamp)}
                                                    </span>
                                                    {notification.actionRequired && (
                                                        <Badge
                                                            variant='outline'
                                                            className='text-xs'
                                                        >
                                                            Action Required
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        variant='outline'
                                                        className={cn(
                                                            'text-xs',
                                                            getPriorityColor(notification.priority)
                                                        )}
                                                    >
                                                        {notification.priority}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-1'>
                                                {!notification.isRead && (
                                                    <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                                                )}
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    className='h-6 w-6 p-0 hover:bg-red-100'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dismissNotification(notification.id);
                                                    }}
                                                >
                                                    <X className='h-3 w-3' />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className='flex items-center justify-between mt-4 pt-4 border-t'>
                        <div className='text-sm text-muted-foreground'>
                            {notifications.length} total notifications
                        </div>
                        <Button variant='outline' size='sm'>
                            View All
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
