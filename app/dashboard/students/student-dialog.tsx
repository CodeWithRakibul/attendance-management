'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconX, IconEdit, IconUser, IconUsers, IconCalendar, IconCreditCard, IconNotes } from '@tabler/icons-react';
import { StudentOverviewTab } from './tabs/student-overview-tab';
import { StudentGuardianTab } from './tabs/student-guardian-tab';
import { StudentAttendanceTab } from './tabs/student-attendance-tab';
import { StudentFeesTab } from './tabs/student-fees-tab';
import { StudentNotesTab } from './tabs/student-notes-tab';
import { StudentFormDialog } from './student-form-dialog';
import { getStudent } from './actions';
import { Student, Session, Class, Batch, Section, StudentNote, Collection, AttendanceStudent, FeeMaster, Teacher } from '@prisma/client';

// Type for student with all relations and proper JSON field types
type StudentWithRelations = Student & {
  session: Session;
  class: Class;
  batch: Batch;
  section: Section;
  notes: (StudentNote & {
    staff: Teacher;
  })[];
  collections: (Collection & {
    feeMaster: FeeMaster;
  })[];
  attendanceStudent: AttendanceStudent[];
} & {
  personal: {
    nameEn: string;
    nameBn?: string;
    dob: string;
    gender: string;
    bloodGroup?: string;
    photoUrl?: string;
  };
  guardian: {
    fatherName: string;
    motherName: string;
    occupations: {
      father?: string;
      mother?: string;
    };
    contact: {
      smsNo: string;
      altNo?: string;
      email?: string;
    };
  };
  address: {
    present: string;
    permanent: string;
  };
};

interface StudentDialogProps {
  open: boolean;
  onClose: () => void;
  student: StudentWithRelations | null;
}

export function StudentDialog({ open, onClose, student }: StudentDialogProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [detailedStudent, setDetailedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (open && student) {
      loadDetailedStudent();
      setActiveTab('overview');
    }
  }, [open, student]);

  const loadDetailedStudent = async () => {
    if (!student) return;
    
    try {
      setLoading(true);
      const detailed = await getStudent(student.id);
      setDetailedStudent(detailed);
    } catch (error) {
      console.error('Failed to load detailed student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleEditClose = () => {
    setShowEditForm(false);
    loadDetailedStudent(); // Refresh data after edit
  };

  if (!student) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'INACTIVE':
        return 'secondary';
      case 'DISABLED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Dialog open={open && !showEditForm} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Student Profile</DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleEditClick}>
                  <IconEdit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <IconX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading student details...</div>
            </div>
          ) : (
            <>
              {/* Student Header */}
              <div className="flex-shrink-0 border-b pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={student.personal.photoUrl} alt={student.personal.nameEn} />
                    <AvatarFallback className="text-lg">
                      {student.personal.nameEn.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{student.personal.nameEn}</h2>
                      <Badge variant={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </div>
                    
                    {student.personal.nameBn && (
                      <p className="text-lg text-muted-foreground mb-1">{student.personal.nameBn}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>ID: {student.studentId}</span>
                      <span>•</span>
                      <span>Roll: {student.roll}</span>
                      <span>•</span>
                      <span>{student.class.name} - {student.batch.name}</span>
                      <span>•</span>
                      <span>{student.section.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="flex-shrink-0 grid w-full grid-cols-5">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <IconUser className="h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="guardian" className="flex items-center gap-2">
                      <IconUsers className="h-4 w-4" />
                      Guardian
                    </TabsTrigger>
                    <TabsTrigger value="attendance" className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      Attendance
                    </TabsTrigger>
                    <TabsTrigger value="fees" className="flex items-center gap-2">
                      <IconCreditCard className="h-4 w-4" />
                      Fees
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex items-center gap-2">
                      <IconNotes className="h-4 w-4" />
                      Notes
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-auto mt-4">
                    <TabsContent value="overview" className="h-full">
                      <StudentOverviewTab student={detailedStudent || student} />
                    </TabsContent>
                    
                    <TabsContent value="guardian" className="h-full">
                      <StudentGuardianTab student={detailedStudent || student} />
                    </TabsContent>
                    
                    <TabsContent value="attendance" className="h-full">
                      <StudentAttendanceTab student={detailedStudent || student} />
                    </TabsContent>
                    
                    <TabsContent value="fees" className="h-full">
                      <StudentFeesTab student={detailedStudent || student} />
                    </TabsContent>
                    
                    <TabsContent value="notes" className="h-full">
                      <StudentNotesTab 
                        student={detailedStudent || student} 
                        onNotesUpdate={loadDetailedStudent}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      {showEditForm && (
        <StudentFormDialog
          open={showEditForm}
          onClose={handleEditClose}
          student={detailedStudent || student}
        />
      )}
    </>
  );
}