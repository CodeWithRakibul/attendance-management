'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { IconLoader2, IconNotes } from '@tabler/icons-react';
import { addStudentNoteAction } from '@/actions/student-note';
import { toast } from 'sonner';

interface AddNoteDialogProps {
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddNoteDialog({ studentId, open, onOpenChange }: AddNoteDialogProps) {
  const [note, setNote] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!note.trim()) {
      toast.error('Please enter a note');
      return;
    }

    startTransition(async () => {
      try {
        const result = await addStudentNoteAction({
          studentId,
          note: note.trim()
        });

        if (result.success) {
          toast.success('Note added successfully!');
          setNote('');
          onOpenChange(false);
        } else {
          toast.error(result.error || 'Failed to add note');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconNotes className="h-5 w-5" />
            Add Student Note
          </DialogTitle>
          <DialogDescription>
            Add a note about this student that will be visible to all staff members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className='block' htmlFor="note">Note *</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your note about the student..."
              rows={4}
              required
              autoFocus
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !note.trim()}>
              {isPending ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Note'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}