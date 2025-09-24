import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)'
                } as React.CSSProperties
            }
        >
            <AppSidebar variant='inset' />
            <SidebarInset>
                <div className='h-[98vh] sticky top-0 overflow-y-auto'>
                    <div className='sticky top-0 z-20'>
                        <SiteHeader />
                    </div>
                    <div className='flex flex-1 flex-col'>
                        <div className='@container/main flex flex-1 flex-col gap-2'>
                            <div className='py-4 md:py-6 px-4 lg:px-6'>{children}</div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    );
}
