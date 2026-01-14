import { Button } from '@/components/ui/button';
import { IconPlus, IconDownload, IconUpload } from '@tabler/icons-react';
import { AddStudentDialog } from './add-student-dialog';
import { getSessions, getClasses, getBatches, getSections, getCurrentSession } from '@/queries';

export async function StudentsHeader() {
  // Fetch required data for the add student dialog
  const currentSession = await getCurrentSession();
  const sessionId = currentSession?.id || '';
  
  const [sessions, classes, batches, sections] = await Promise.all([
    getSessions(),
    getClasses(sessionId),
    getBatches(undefined, sessionId),
    getSections(undefined, sessionId),
  ]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Students</h1>
        <p className="text-muted-foreground">
          Manage student information, enrollment, and academic records
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <IconDownload className="h-4 w-4" />
          Export
        </Button>
        
        <Button variant="outline" className="gap-2">
          <IconUpload className="h-4 w-4" />
          Import
        </Button>
        
        <AddStudentDialog
          sessions={sessions.map(s => ({ id: s.id, year: s.year }))}
          classes={classes}
          batches={batches}
          sections={sections}
        >
          <Button className="gap-2">
            <IconPlus className="h-4 w-4" />
            Add Student
          </Button>
        </AddStudentDialog>
      </div>
    </div>
  );
}