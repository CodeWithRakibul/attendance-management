'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconArrowLeft, IconLoader2, IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { updateStudentAction } from '../../../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { StudentWithRelations, StudentStatus } from '@/types/student';
import { Save } from 'lucide-react';
import SubmitButton from '@/components/submit-button';

interface StudentEditFormProps {
  student: StudentWithRelations;
  sessions: Array<{ id: string; year: string }>;
  classes: Array<{ id: string; name: string }>;
  batches: Array<{ id: string; name: string }>;
  sections: Array<{ id: string; name: string }>;
}

export function StudentEditForm({ student, sessions, classes, batches, sections }: StudentEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const personal = student.personal as any;
  const guardian = student.guardian as any;
  const address = student.address as any;
  const contact = guardian?.contact || {};

  const [formData, setFormData] = useState({
    nameEn: personal?.nameEn || '',
    nameBn: personal?.nameBn || '',
    fatherName: guardian?.fatherName || '',
    motherName: guardian?.motherName || '',
    dateOfBirth: personal?.dob ? new Date(personal.dob) : undefined,
    gender: personal?.gender || '',
    bloodGroup: personal?.bloodGroup || '',
    phone: contact?.smsNo || '',
    email: contact?.email || '',
    address: address?.present || '',
    sessionId: student.sessionId,
    classId: student.classId,
    batchId: student.batchId,
    sectionId: student.sectionId,
    roll: student.roll || '',
    status: student.status,
    fatherOccupation: guardian?.fatherOccupation || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await updateStudentAction(student.id, {
          studentId: student.studentId,
          sessionId: formData.sessionId,
          classId: formData.classId,
          batchId: formData.batchId,
          sectionId: formData.sectionId,
          roll: formData.roll,
          personal: {
            nameEn: formData.nameEn,
            nameBn: formData.nameBn,
            dob: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : '',
            gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
            bloodGroup: formData.bloodGroup
          },
          guardian: {
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            fatherOccupation: formData.fatherOccupation,
            contact: {
              smsNo: formData.phone,
              email: formData.email
            }
          },
          address: {
            present: formData.address
          },
          status: formData.status as any,
          continuityTick: student.continuityTick
        });

        if (result.success) {
          toast.success('Student updated successfully!');
          router.push(`/dashboard/students/${student.id}`);
        } else {
          toast.error(result.error || 'Failed to update student');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Student</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nameEn" className="block mb-2">Name (English) *</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="nameBn" className="block mb-2">Name (Bangla)</Label>
                  <Input
                    id="nameBn"
                    value={formData.nameBn}
                    onChange={(e) => setFormData(prev => ({ ...prev, nameBn: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fatherName" className="block mb-2">Father's Name *</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="motherName" className="block mb-2">Mother's Name</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="block mb-2">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <IconCalendar className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        className='w-full'
                        mode="single"
                        selected={formData.dateOfBirth}
                        onSelect={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="gender" className="block mb-2">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bloodGroup" className="block mb-2">Blood Group</Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => setFormData(prev => ({ ...prev, bloodGroup: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-2" htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    maxLength={11}
                  />
                </div>
                <div>
                  <Label className="block mb-2" htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label className="block mb-2" htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label className="block mb-2" htmlFor="fatherOccupation">Father's Occupation</Label>
                <Input
                  id="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherOccupation: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="block mb-2" htmlFor="sessionId">Session *</Label>
                <Select value={formData.sessionId} onValueChange={(value) => setFormData(prev => ({ ...prev, sessionId: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2" htmlFor="classId">Class *</Label>
                <Select value={formData.classId} onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2" htmlFor="batchId">Batch</Label>
                <Select value={formData.batchId} onValueChange={(value) => setFormData(prev => ({ ...prev, batchId: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2" htmlFor="sectionId">Section</Label>
                <Select value={formData.sectionId} onValueChange={(value) => setFormData(prev => ({ ...prev, sectionId: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2" htmlFor="roll">Roll Number</Label>
                <Input
                  id="roll"
                  type="number"
                  value={formData.roll}
                  onChange={(e) => setFormData(prev => ({ ...prev, roll: e.target.value }))}
                />
              </div>

              <div>
                <Label className="block mb-2" htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: StudentStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="DISABLED">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <SubmitButton type="submit" loading={isPending}>
            <Save className="size-4" />
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}