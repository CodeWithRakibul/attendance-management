'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateStudentNoteAction } from '@/actions/student';
import { toast } from 'sonner';

interface EditNoteDialogProps {
  noteId: string;
  currentNote: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNoteDialog({ noteId, currentNote, open, onOpenChange }: EditNoteDialogProps) {
  const [note, setNote] = useState(currentNote);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setLoading(true);
    const result = await updateStudentNoteAction(noteId, note.trim());
    
    if (result.success) {
      toast.success('Note updated successfully');
      onOpenChange(false);
    } else {
      toast.error(result.error || 'Failed to update note');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter note..."
            rows={4}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !note.trim()}>
              {loading ? 'Updating...' : 'Update Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}