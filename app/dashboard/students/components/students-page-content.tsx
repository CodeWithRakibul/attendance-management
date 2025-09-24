import { Suspense } from 'react';
import { StudentsDataTable } from './students-data-table';
import { StudentsStats } from './students-stats';
import {
    getStudents,
    getSessions,
    getClasses,
    getBatches,
    getSections,
    getCurrentSession
} from '../actions';
import { Card, CardContent } from '@/components/ui/card';
import { IconUsers, IconUserPlus, IconUserCheck, IconCreditCard } from '@tabler/icons-react';

interface StudentsPageContentProps {
    searchParams: {
        search?: string;
        class?: string;
        status?: string;
        batch?: string;
        gender?: string;
        section?: string;
    };
}

export async function StudentsPageContent({ searchParams }: StudentsPageContentProps) {
    // Get current session first
    const currentSession = await getCurrentSession();

    // If no current session, show message to create one
    if (!currentSession) {
        return (
            <Card>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                    <IconUsers className='h-12 w-12 text-muted-foreground mb-4' />
                    <h3 className='text-lg font-semibold mb-2'>No Active Session</h3>
                    <p className='text-muted-foreground text-center mb-4'>
                        Please create and activate a session to manage students.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const sessionId = currentSession.id;

    // Fetch all required data
    const [students, sessions, classes, batches, sections] = await Promise.all([
        getStudents(sessionId, {
            search: searchParams.search || '',
            classId:
                searchParams.class && searchParams.class !== 'all' ? searchParams.class : undefined,
            status:
                searchParams.status && searchParams.status !== 'all'
                    ? (searchParams.status as any)
                    : undefined,
            batchId:
                searchParams.batch && searchParams.batch !== 'all' ? searchParams.batch : undefined
        }),
        getSessions(),
        getClasses(sessionId),
        getBatches(undefined, sessionId),
        getSections(undefined, sessionId)
    ]);

    // Apply additional client-side filters
    const filteredStudents = students.filter((student) => {
        const personal = student.personal as any;
        if (
            searchParams.gender &&
            searchParams.gender !== 'all' &&
            personal?.gender !== searchParams.gender
        ) {
            return false;
        }
        if (
            searchParams.section &&
            searchParams.section !== 'all' &&
            student.section?.name !== searchParams.section
        ) {
            return false;
        }
        return true;
    });

    // Calculate statistics
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === 'ACTIVE').length;

    // Calculate new admissions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newAdmissions = students.filter((s) => new Date(s.createdAt) >= thirtyDaysAgo).length;

    // Mock pending fees calculation (you can implement actual logic)
    const pendingFees = Math.floor(students.length * 0.15); // Assume 15% have pending fees

    // Get unique values for filters
    const uniqueClasses = [...new Set(students.map((s) => s.class?.name).filter(Boolean))].sort();
    const uniqueBatches = [...new Set(students.map((s) => s.batch?.name).filter(Boolean))].sort();
    const uniqueSections = [
        ...new Set(students.map((s) => s.section?.name).filter(Boolean))
    ].sort();

    const currentFilters = {
        search: searchParams.search || '',
        class: searchParams.class || 'all',
        status: searchParams.status || 'all',
        batch: searchParams.batch || 'all',
        gender: searchParams.gender || 'all',
        section: searchParams.section || 'all'
    };

    const statsData = [
        {
            title: 'Total Students',
            value: totalStudents,
            icon: IconUsers,
            trend: null,
            color: 'blue'
        },
        {
            title: 'Active Students',
            value: activeStudents,
            icon: IconUserCheck,
            trend: null,
            color: 'green'
        },
        {
            title: 'New Admissions',
            value: newAdmissions,
            icon: IconUserPlus,
            trend: { value: 12, isPositive: true },
            color: 'purple'
        },
        {
            title: 'Pending Fees',
            value: pendingFees,
            icon: IconCreditCard,
            trend: { value: 8, isPositive: false },
            color: 'orange'
        }
    ];

    const handleEdit = async (student: any) => {
        'use server';
        // This will be handled by client component
    };

    const handleDelete = async (studentId: string) => {
        'use server';
        // This will be handled by client component
    };

    const handleView = async (student: any) => {
        'use server';
        // This will be handled by client component
    };

    return (
        <div className='space-y-6'>
            {/* Statistics */}
            <StudentsStats
                totalStudents={totalStudents}
                activeStudents={activeStudents}
                newAdmissions={newAdmissions}
                pendingFees={pendingFees}
            />

            {/* Data Table */}
            <StudentsDataTable
                students={filteredStudents}
                sessions={sessions}
                classes={classes}
                batches={batches}
                sections={sections}
            />

            {/* Empty State */}
            {filteredStudents.length === 0 && (
                <Card className='border-2 border-dashed border-gray-200'>
                    <CardContent className='flex flex-col items-center justify-center py-12'>
                        <div className='p-4 bg-gray-100 rounded-full mb-4'>
                            <IconUsers className='h-8 w-8 text-gray-400' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            No students found
                        </h3>
                        <p className='text-gray-600 text-center max-w-md'>
                            {totalStudents === 0
                                ? 'Get started by adding your first student to the system.'
                                : 'Try adjusting your filters or search terms to find students.'}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
