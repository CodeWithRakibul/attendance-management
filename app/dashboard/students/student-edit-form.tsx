'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconDeviceFloppy, IconX, IconUser, IconUsers, IconMapPin, IconSchool } from '@tabler/icons-react';
import { updateStudent, getSessions, getClasses, getBatches, getSections } from './actions';
import { toast } from 'sonner';

interface StudentEditFormProps {
  student: any;
  onSave: () => void;
  onCancel: () => void;
}

export function StudentEditForm({ student, onSave, onCancel }: StudentEditFormProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    religion: '',
    
    // Guardian Information
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    motherName: '',
    motherPhone: '',
    motherOccupation: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: '',
    
    // Address Information
    presentAddress: '',
    permanentAddress: '',
    
    // Academic Information
    studentId: '',
    sessionId: '',
    classId: '',
    batchId: '',
    sectionId: '',
    roll: '',
    rollNumber: '',
    registrationNumber: '',
    
    // Status
    status: 'ACTIVE'
  });

  const [sessions, setSessions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email || '',
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
        gender: student.gender || '',
        bloodGroup: student.bloodGroup || '',
        religion: student.religion || '',
        
        fatherName: student.fatherName || '',
        fatherPhone: student.fatherPhone || '',
        fatherOccupation: student.fatherOccupation || '',
        motherName: student.motherName || '',
        motherPhone: student.motherPhone || '',
        motherOccupation: student.motherOccupation || '',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
        guardianRelation: student.guardianRelation || '',
        
        presentAddress: student.presentAddress || '',
        permanentAddress: student.permanentAddress || '',
        
        studentId: student.studentId || '',
        sessionId: student.sessionId || '',
        classId: student.classId || '',
        batchId: student.batchId || '',
        sectionId: student.sectionId || '',
        roll: student.roll || '',
        rollNumber: student.rollNumber || '',
        registrationNumber: student.registrationNumber || '',
        
        status: student.status || 'ACTIVE'
      });
    }
  }, [student]);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    setLoading(true);
    try {
      const [sessionsData, classesData, batchesData, sectionsData] = await Promise.all([
        getSessions(),
        getClasses(),
        getBatches(),
        getSections()
      ]);

      setSessions(sessionsData);
      setClasses(classesData);
      setBatches(batchesData);
      setSections(sectionsData);
    } catch (error) {
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      toast.error('First name and last name are required');
      return;
    }

    setSaving(true);
    try {
      const result = await updateStudent(student.id, {
        studentId: formData.studentId,
        sessionId: formData.sessionId,
        classId: formData.classId,
        batchId: formData.batchId,
        sectionId: formData.sectionId,
        roll: formData.roll,
        personal: {
          nameEn: `${formData.firstName} ${formData.lastName}`,
          nameBn: '',
          dob: formData.dateOfBirth,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          photoUrl: ''
        },
        guardian: {
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          occupations: {
            father: formData.fatherOccupation,
            mother: formData.motherOccupation
          },
          contact: {
            smsNo: formData.fatherPhone,
            altNo: formData.motherPhone,
            email: formData.email
          }
        },
        address: {
          present: formData.presentAddress,
          permanent: formData.permanentAddress
        }
      });

      if (result.success) {
        toast.success('Student updated successfully');
        onSave();
      } else {
        toast.error(result.error || 'Failed to update student');
      }
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
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
            <div>
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
            <div>
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                value={formData.religion}
                onChange={(e) => handleInputChange('religion', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Guardian Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fatherName">Father&apos;s Name</Label>
              <Input
                id="fatherName"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fatherPhone">Father&apos;s Phone</Label>
              <Input
                id="fatherPhone"
                value={formData.fatherPhone}
                onChange={(e) => handleInputChange('fatherPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fatherOccupation">Father&apos;s Occupation</Label>
              <Input
                id="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="motherName">Mother&apos;s Name</Label>
              <Input
                id="motherName"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="motherPhone">Mother&apos;s Phone</Label>
              <Input
                id="motherPhone"
                value={formData.motherPhone}
                onChange={(e) => handleInputChange('motherPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="motherOccupation">Mother&apos;s Occupation</Label>
              <Input
                id="motherOccupation"
                value={formData.motherOccupation}
                onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="guardianName">Guardian Name</Label>
              <Input
                id="guardianName"
                value={formData.guardianName}
                onChange={(e) => handleInputChange('guardianName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="guardianPhone">Guardian Phone</Label>
              <Input
                id="guardianPhone"
                value={formData.guardianPhone}
                onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="guardianRelation">Guardian Relation</Label>
              <Input
                id="guardianRelation"
                value={formData.guardianRelation}
                onChange={(e) => handleInputChange('guardianRelation', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="presentAddress">Present Address</Label>
            <Textarea
              id="presentAddress"
              value={formData.presentAddress}
              onChange={(e) => handleInputChange('presentAddress', e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="permanentAddress">Permanent Address</Label>
            <Textarea
              id="permanentAddress"
              value={formData.permanentAddress}
              onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSchool className="h-5 w-5" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionId">Session</Label>
              <Select value={formData.sessionId} onValueChange={(value) => handleInputChange('sessionId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="classId">Class</Label>
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
            <div>
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
            <div>
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
            <div>
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                value={formData.rollNumber}
                onChange={(e) => handleInputChange('rollNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              />
            </div>
            <div>
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
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          <IconX className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          <IconDeviceFloppy className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}