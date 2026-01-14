import { Suspense } from 'react';
import { StudentsPageContent } from './_components/students-page-content';
import { StudentsPageSkeleton } from './_components/students-page-skeleton';

export default async function StudentsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Await searchParams for Next.js 15 compatibility
    const params = await searchParams;

    // Get filter parameters from URL
    const search = typeof params.search === 'string' ? params.search : '';
    const classFilter = typeof params.class === 'string' ? params.class : 'all';
    const statusFilter = typeof params.status === 'string' ? params.status : 'all';
    const batchFilter = typeof params.batch === 'string' ? params.batch : 'all';
    const genderFilter = typeof params.gender === 'string' ? params.gender : 'all';
    const sectionFilter = typeof params.section === 'string' ? params.section : 'all';

    return (
        <Suspense fallback={<StudentsPageSkeleton />}>
            <StudentsPageContent
                searchParams={{
                    search,
                    class: classFilter,
                    status: statusFilter,
                    batch: batchFilter,
                    gender: genderFilter,
                    section: sectionFilter
                }}
            />
        </Suspense>
    );
}
