'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { IconEdit, IconArrowLeft, IconUser, IconPhone, IconSchool, IconNotes, IconPlus, IconCalendar, IconMapPin } from '@tabler/icons-react';
import { EditStudentDialog } from '../../components/edit-student-dialog';
import { AddNoteDialog } from './add-note-dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentWithRelations } from '@/types/student';

interface StudentProfileProps {
  student: StudentWithRelations;
  sessions: Array<{ id: string; year: string }>;
  classes: Array<{ id: string; name: string }>;
  batches: Array<{ id: string; name: string }>;
  sections: Array<{ id: string; name: string }>;
}

export function StudentProfile({ student, sessions, classes, batches, sections }: StudentProfileProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const router = useRouter();
  
  const personal = student.personal as any;
  const guardian = student.guardian as any;
  const address = student.address as any;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={personal?.photoUrl} alt={personal?.nameEn} />
              <AvatarFallback className="text-lg">
                {personal?.nameEn?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{personal?.nameEn}</h1>
              <p className="text-muted-foreground">{personal?.nameBn}</p>
              <Badge variant="outline">ID: {student.studentId}</Badge>
            </div>
          </div>
        </div>
        <Button onClick={() => setEditOpen(true)}>
          <IconEdit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Tabs */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUser className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                    <p className="font-medium">{guardian?.fatherName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                    <p className="font-medium">{guardian?.motherName || 'N/A'}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="font-medium">{personal?.dob ? new Date(personal.dob).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="font-medium">{personal?.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                    <p className="font-medium">{personal?.bloodGroup || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconPhone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <IconPhone className="h-3 w-3" />
                      Phone
                    </label>
                    <p className="font-medium">{guardian?.contact?.smsNo || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <IconPhone className="h-3 w-3" />
                      Email
                    </label>
                    <p className="font-medium">{guardian?.contact?.email || 'N/A'}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconMapPin className="h-3 w-3" />
                    Address
                  </label>
                  <p className="font-medium leading-relaxed">{address?.present || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSchool className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Session</label>
                <p>{student.session?.year}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Class</label>
                <p>{student.class?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Batch</label>
                <p>{student.batch?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Section</label>
                <p>{student.section?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Roll</label>
                <p>{student.roll}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge>{student.status}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Attendance data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fee collection data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <IconNotes className="h-5 w-5" />
                  Staff Notes
                </CardTitle>
                <Button onClick={() => setNoteOpen(true)} size="sm">
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {student.notes && student.notes.length > 0 ? (
                <div className="space-y-4">
                  {student.notes.map((note, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{note.note}</p>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <IconUser className="h-3 w-3" />
                          {(note.staff.personal as any)?.nameEn || 'Staff'}
                        </div>
                        <div className="flex items-center gap-1">
                          <IconCalendar className="h-3 w-3" />
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <IconNotes className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No notes available for this student.</p>
                  <Button onClick={() => setNoteOpen(true)} variant="outline">
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add First Note
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditStudentDialog
        student={student as any}
        open={editOpen}
        onOpenChange={setEditOpen}
        sessions={sessions}
        classes={classes}
        batches={batches}
        sections={sections}
      />
      
      <AddNoteDialog
        studentId={student.id}
        open={noteOpen}
        onOpenChange={setNoteOpen}
      />
    </div>
  );
}