import { Suspense } from 'react';
import { getSessionsAction, getClassesAction } from '@/actions/academics';
import { ClassesPageContent } from './components/classes-page-content';
import { getSessions, getCurrentSession } from '@/queries/session';

export default async function ClassesPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const sessionParam = typeof params.session === 'string' ? params.session : undefined;

    const sessions = await getSessionsAction();
    const activeSession = await getCurrentSession();
    
    // Determine which session to show:
    // 1. URL param
    // 2. Active session
    // 3. First available session
    const currentSessionId = sessionParam || activeSession?.id || sessions[0]?.id || '';

    let classes: any[] = [];
    if (currentSessionId) {
        classes = await getClassesAction(currentSessionId);
    }

    return (
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <Suspense fallback={<div>Loading classes...</div>}>
                <ClassesPageContent 
                    classes={classes} 
                    sessions={sessions} 
                    currentSessionId={currentSessionId}
                />
            </Suspense>
        </div>
    );
}
