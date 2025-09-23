'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StudentEditForm } from './student-edit-form';
import { Student } from './columns';

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}

export function StudentFormDialog({ open, onClose, student }: StudentFormDialogProps) {
  const handleSave = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Edit Student' : 'Add Student'}
          </DialogTitle>
        </DialogHeader>
        <StudentEditForm
          student={student}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}