import { Suspense } from 'react';
import { getSessionsAction } from '@/actions/academics';
import { SessionsPageContent } from './components/sessions-page-content';

export default async function SessionsPage() {
    const sessions = await getSessionsAction();

    return (
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <Suspense fallback={<div>Loading sessions...</div>}>
                <SessionsPageContent sessions={sessions} />
            </Suspense>
        </div>
    );
}
