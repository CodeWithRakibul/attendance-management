import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconNotes, IconPlus } from '@tabler/icons-react';
import { NoteCard } from './note-card';
import { deleteStudentNoteAction } from '@/actions';
import { toast } from 'sonner';
import { AlertModal } from '@/components/alert-modal';
import { useState } from 'react';

interface NotesTabProps {
  notes: Array<{
    id: string;
    note: string;
    createdAt: Date;
    staff: {
      personal: any;
    };
  }>;
  onAddNote: () => void;
  onEditNote: (id: string, note: string) => void;
}

export function NotesTab({ notes, onAddNote, onEditNote }: NotesTabProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    
    setIsDeleting(true);
    const result = await deleteStudentNoteAction(noteToDelete);
    
    if (result.success) {
      toast.success('Note deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete note');
    }
    
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setNoteToDelete(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconNotes className="h-5 w-5" />
              Staff Notes
            </CardTitle>
            <Button onClick={onAddNote} size="sm">
              <IconPlus className="size-4" />
              Add Note
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notes && notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={onEditNote}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconNotes className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No notes available for this student.</p>
              <Button onClick={onAddNote} variant="outline">
                <IconPlus className="size-4" />
                Add First Note
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        loading={isDeleting}
        confirmLabel="Delete"
      />
    </>
  );
}