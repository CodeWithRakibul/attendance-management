'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconUser, IconPhone, IconSchool, IconNotes, IconCalendar } from '@tabler/icons-react';
import { AddNoteDialog } from './add-note-dialog';
import { EditNoteDialog } from './edit-note-dialog';
import { StudentHeader } from './student-header';
import { OverviewTab } from './overview-tab';
import { AcademicTab } from './academic-tab';
import { NotesTab } from './notes-tab';
import { PlaceholderTab } from './placeholder-tab';
import { useState } from 'react';
import { StudentWithRelations } from '@/types/student';

interface StudentProfileProps {
  student: StudentWithRelations;
  sessions: Array<{ id: string; year: string }>;
  classes: Array<{ id: string; name: string }>;
  batches: Array<{ id: string; name: string }>;
  sections: Array<{ id: string; name: string }>;
}

export function StudentProfile({ student }: StudentProfileProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [editNoteOpen, setEditNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{ id: string; note: string } | null>(null);

  const handleEditNote = (noteId: string, noteText: string) => {
    setSelectedNote({ id: noteId, note: noteText });
    setEditNoteOpen(true);
  };

  const personal = student.personal as any;
  const guardian = student.guardian as any;
  const address = student.address as any;

  return (
    <div className="space-y-6">
      <StudentHeader 
        student={student} 
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <IconUser className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <IconSchool className="h-4 w-4" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <IconCalendar className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center gap-2">
            <IconPhone className="h-4 w-4" />
            Fees
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <IconNotes className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab 
            personal={personal} 
            guardian={guardian} 
            address={address} 
          />
        </TabsContent>

        <TabsContent value="academic">
          <AcademicTab student={student} />
        </TabsContent>

        <TabsContent value="attendance">
          <PlaceholderTab 
            title="Attendance Records" 
            message="Attendance data will be displayed here." 
          />
        </TabsContent>

        <TabsContent value="fees">
          <PlaceholderTab 
            title="Fee Records" 
            message="Fee collection data will be displayed here." 
          />
        </TabsContent>

        <TabsContent value="notes">
          <NotesTab 
            notes={student.notes || []} 
            onAddNote={() => setNoteOpen(true)}
            onEditNote={handleEditNote}
          />
        </TabsContent>
      </Tabs>

      <AddNoteDialog
        studentId={student.id}
        open={noteOpen}
        onOpenChange={setNoteOpen}
      />

      {selectedNote && (
        <EditNoteDialog
          noteId={selectedNote.id}
          currentNote={selectedNote.note}
          open={editNoteOpen}
          onOpenChange={(open) => {
            setEditNoteOpen(open);
            if (!open) setSelectedNote(null);
          }}
        />
      )}
    </div>
  );
}