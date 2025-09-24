'use client';

import { useState, useTransition, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconUser, IconPhone, IconMail, IconCalendar, IconMapPin, IconLoader2, IconEdit } from '@tabler/icons-react';
import { updateStudentAction } from '../actions';
import { toast } from 'sonner';
import { StudentTableData } from '@/types/student';

interface EditStudentDialogProps {
  student: StudentTableData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: Array<{ id: string; year: string }>;
  classes: Array<{ id: string; name: string }>;
  batches: Array<{ id: string; name: string }>;
  sections: Array<{ id: string; name: string }>;
}

export function EditStudentDialog({ 
  student, 
  open, 
  onOpenChange, 
  sessions, 
  classes, 
  batches, 
  sections 
}: EditStudentDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    fatherNameEn: '',
    fatherNameBn: '',
    motherNameEn: '',
    motherNameBn: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    religion: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    sessionId: '',
    classId: '',
    batchId: '',
    sectionId: '',
    rollNumber: '',
    registrationNumber: '',
    previousSchool: '',
    guardianOccupation: '',
    monthlyIncome: '',
    notes: '',
    status: '',
  });

  useEffect(() => {
    if (student) {
      const personal = student.personal as any;
      const guardian = student.guardian as any;
      const address = student.address as any;
      const contact = guardian?.contact;
      
      setFormData({
        nameEn: personal?.nameEn || '',
        nameBn: personal?.nameBn || '',
        fatherNameEn: guardian?.fatherName || '',
        fatherNameBn: guardian?.fatherNameBn || '',
        motherNameEn: guardian?.motherName || '',
        motherNameBn: guardian?.motherNameBn || '',
        dateOfBirth: personal?.dob ? new Date(personal.dob).toISOString().split('T')[0] : '',
        gender: personal?.gender || '',
        bloodGroup: personal?.bloodGroup || '',
        religion: personal?.religion || '',
        phone: contact?.smsNo || '',
        email: contact?.email || '',
        address: address?.present || '',
        emergencyContact: contact?.altNo || '',
        sessionId: student.sessionId || '',
        classId: student.classId || '',
        batchId: student.batchId || '',
        sectionId: student.sectionId || '',
        rollNumber: student.roll || '',
        registrationNumber: student.studentId || '',
        previousSchool: guardian?.previousSchool || '',
        guardianOccupation: guardian?.occupation || '',
        monthlyIncome: guardian?.monthlyIncome ? guardian.monthlyIncome.toString() : '',
        notes: '',
        status: student.status || '',
      });
    }
  }, [student]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) return;
    
    startTransition(async () => {
      try {
        const result = await updateStudentAction(student.id, {
          studentId: formData.registrationNumber,
          sessionId: formData.sessionId,
          classId: formData.classId,
          batchId: formData.batchId,
          sectionId: formData.sectionId,
          roll: formData.rollNumber,
          personal: {
            nameEn: formData.nameEn,
            nameBn: formData.nameBn,
            dob: formData.dateOfBirth,
            gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
            bloodGroup: formData.bloodGroup
          },
          guardian: {
            fatherName: formData.fatherNameEn,
            motherName: formData.motherNameEn,
            fatherOccupation: formData.guardianOccupation,
            contact: {
              smsNo: formData.phone,
              altNo: formData.emergencyContact,
              email: formData.email
            }
          },
          address: {
            present: formData.address
          },
          status: formData.status as any,
          continuityTick: false
        });

        if (result.success) {
          toast.success('Student updated successfully!');
          onOpenChange(false);
          setCurrentStep(1);
        } else {
          toast.error(result.error || 'Failed to update student');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.nameEn && formData.fatherNameEn && formData.gender;
      case 2:
        return formData.phone || formData.email;
      case 3:
        return formData.sessionId && formData.classId;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">Name (English) *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => handleInputChange('nameEn', e.target.value)}
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameBn">Name (Bangla)</Label>
                <Input
                  id="nameBn"
                  value={formData.nameBn}
                  onChange={(e) => handleInputChange('nameBn', e.target.value)}
                  placeholder="শিক্ষার্থীর নাম"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherNameEn">Father's Name (English) *</Label>
                <Input
                  id="fatherNameEn"
                  value={formData.fatherNameEn}
                  onChange={(e) => handleInputChange('fatherNameEn', e.target.value)}
                  placeholder="Enter father's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherNameBn">Father's Name (Bangla)</Label>
                <Input
                  id="fatherNameBn"
                  value={formData.fatherNameBn}
                  onChange={(e) => handleInputChange('fatherNameBn', e.target.value)}
                  placeholder="পিতার নাম"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherNameEn">Mother's Name (English)</Label>
                <Input
                  id="motherNameEn"
                  value={formData.motherNameEn}
                  onChange={(e) => handleInputChange('motherNameEn', e.target.value)}
                  placeholder="Enter mother's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherNameBn">Mother's Name (Bangla)</Label>
                <Input
                  id="motherNameBn"
                  value={formData.motherNameBn}
                  onChange={(e) => handleInputChange('motherNameBn', e.target.value)}
                  placeholder="মাতার নাম"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
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

            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISLAM">Islam</SelectItem>
                  <SelectItem value="HINDUISM">Hinduism</SelectItem>
                  <SelectItem value="CHRISTIANITY">Christianity</SelectItem>
                  <SelectItem value="BUDDHISM">Buddhism</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Enter emergency contact number"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session *</Label>
                <Select value={formData.sessionId} onValueChange={(value) => handleInputChange('sessionId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
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
              <div className="space-y-2">
                <Label htmlFor="classId">Class *</Label>
                <Select value={formData.classId} onValueChange={(value) => handleInputChange('classId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchId">Batch</Label>
                <Select value={formData.batchId} onValueChange={(value) => handleInputChange('batchId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
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
              <div className="space-y-2">
                <Label htmlFor="sectionId">Section</Label>
                <Select value={formData.sectionId} onValueChange={(value) => handleInputChange('sectionId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={formData.rollNumber}
                  onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                  placeholder="Enter roll number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="Enter registration number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="GRADUATED">Graduated</SelectItem>
                  <SelectItem value="DROPPED">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="previousSchool">Previous School</Label>
              <Input
                id="previousSchool"
                value={formData.previousSchool}
                onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                placeholder="Enter previous school name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianOccupation">Guardian's Occupation</Label>
                <Input
                  id="guardianOccupation"
                  value={formData.guardianOccupation}
                  onChange={(e) => handleInputChange('guardianOccupation', e.target.value)}
                  placeholder="Enter guardian's occupation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                  placeholder="Enter monthly income"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Enter any additional notes"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: IconUser },
    { number: 2, title: 'Contact Info', icon: IconPhone },
    { number: 3, title: 'Academic Info', icon: IconCalendar },
    { number: 4, title: 'Additional Info', icon: IconMapPin },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEdit className="h-5 w-5" />
            Edit Student Information
          </DialogTitle>
          <DialogDescription>
            Update student information. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === step.number 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : currentStep > step.number
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-gray-100 text-gray-500'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const IconComponent = steps[currentStep - 1].icon;
                  return <IconComponent className="h-5 w-5" />;
                })()}
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
              </form>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep < 4 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isPending || !isStepValid(currentStep)}
              >
                {isPending ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Student'
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}