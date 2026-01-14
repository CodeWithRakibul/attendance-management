'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { IconX, IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';
import { updateTeacher, TeacherCreateFormData } from '../../actions';

interface TeacherEditFormProps {
  teacher: any;
  onCancel: () => void;
  onComplete: () => void;
}

export function TeacherEditForm({ teacher, onCancel, onComplete }: TeacherEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherCreateFormData>({
    teacherId: '',
    personal: {
      nameEn: '',
      nameBn: '',
      dob: '',
      gender: '',
      bloodGroup: '',
      photoUrl: '',
    },
    contact: {
      smsNo: '',
      altNo: '',
      email: '',
      address: {
        present: '',
        permanent: '',
      },
    },
    designation: '',
    subjects: [],
    qualification: '',
    experience: '',
    salaryInfo: {
      basic: 0,
      allowances: 0,
      paymentMethod: '',
    },
    joiningDate: '',
    status: 'ACTIVE',
  });
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    if (teacher) {
      setFormData({
        teacherId: teacher.teacherId || '',
        personal: {
          nameEn: teacher.personal?.nameEn || '',
          nameBn: teacher.personal?.nameBn || '',
          dob: teacher.personal?.dob ? new Date(teacher.personal.dob).toISOString().split('T')[0] : '',
          gender: teacher.personal?.gender || '',
          bloodGroup: teacher.personal?.bloodGroup || '',
          photoUrl: teacher.personal?.photoUrl || '',
        },
        contact: {
          smsNo: teacher.contact?.smsNo || '',
          altNo: teacher.contact?.altNo || '',
          email: teacher.contact?.email || '',
          address: {
            present: teacher.contact?.address?.present || '',
            permanent: teacher.contact?.address?.permanent || '',
          },
        },
        designation: teacher.designation || '',
        subjects: teacher.subjects || [],
        qualification: teacher.qualification || '',
        experience: teacher.experience || '',
        salaryInfo: {
          basic: teacher.salaryInfo?.basic || 0,
          allowances: teacher.salaryInfo?.allowances || 0,
          paymentMethod: teacher.salaryInfo?.paymentMethod || '',
        },
        joiningDate: teacher.joiningDate ? new Date(teacher.joiningDate).toISOString().split('T')[0] : '',
        status: teacher.status || 'ACTIVE',
      });
    }
  }, [teacher]);

  const handleInputChange = (field: string, value: any) => {
    const keys = field.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addSubject = () => {
    const trimmedSubject = newSubject.replace(/^\s+|\s+$/g, '');
    if (trimmedSubject && !formData.subjects.includes(trimmedSubject)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, trimmedSubject]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.personal.nameEn || !formData.contact.smsNo || !formData.designation) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await updateTeacher(teacher.id, formData);
      
      if (result.success) {
        toast.success('Teacher updated successfully');
        onComplete();
      } else {
        toast.error(result.error || 'Failed to update teacher');
      }
    } catch (error) {
      console.error('Failed to update teacher:', error);
      toast.error('Failed to update teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nameEn">Full Name (English) *</Label>
              <Input
                id="nameEn"
                value={formData.personal.nameEn}
                onChange={(e) => handleInputChange('personal.nameEn', e.target.value)}
                placeholder="Enter full name in English"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nameBn">Full Name (Bengali)</Label>
              <Input
                id="nameBn"
                value={formData.personal.nameBn}
                onChange={(e) => handleInputChange('personal.nameBn', e.target.value)}
                placeholder="Enter full name in Bengali"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.personal.dob}
                  onChange={(e) => handleInputChange('personal.dob', e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.personal.gender} onValueChange={(value) => handleInputChange('personal.gender', value)}>
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select value={formData.personal.bloodGroup} onValueChange={(value) => handleInputChange('personal.bloodGroup', value)}>
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
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Contact details and address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="smsNo">Primary Phone *</Label>
              <Input
                id="smsNo"
                value={formData.contact.smsNo}
                onChange={(e) => handleInputChange('contact.smsNo', e.target.value)}
                placeholder="Enter primary phone number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="altNo">Alternative Phone</Label>
              <Input
                id="altNo"
                value={formData.contact.altNo}
                onChange={(e) => handleInputChange('contact.altNo', e.target.value)}
                placeholder="Enter alternative phone number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact.email}
                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="presentAddress">Present Address</Label>
              <Textarea
                id="presentAddress"
                value={formData.contact.address.present}
                onChange={(e) => handleInputChange('contact.address.present', e.target.value)}
                placeholder="Enter present address"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <Textarea
                id="permanentAddress"
                value={formData.contact.address.permanent}
                onChange={(e) => handleInputChange('contact.address.permanent', e.target.value)}
                placeholder="Enter permanent address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Job details and qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="teacherId">Teacher ID</Label>
              <Input
                id="teacherId"
                value={formData.teacherId}
                onChange={(e) => handleInputChange('teacherId', e.target.value)}
                placeholder="Enter teacher ID"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                placeholder="Enter designation"
              />
            </div>

            <div className="grid gap-2">
              <Label>Subjects</Label>
              <div className="flex space-x-2">
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add subject"
                  onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                />
                <Button type="button" variant="outline" onClick={addSubject}>
                  <IconPlus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.subjects.map((subject: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="ml-1 hover:text-destructive"
                    >
                      <IconX className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                placeholder="Enter qualification"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Enter experience details"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                id="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={(e) => handleInputChange('joiningDate', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DISABLED">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Salary Information */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Information</CardTitle>
            <CardDescription>Compensation details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="basicSalary">Basic Salary</Label>
              <Input
                id="basicSalary"
                type="number"
                value={formData.salaryInfo.basic}
                onChange={(e) => handleInputChange('salaryInfo.basic', parseInt(e.target.value) || 0)}
                placeholder="Enter basic salary"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="allowances">Allowances</Label>
              <Input
                id="allowances"
                type="number"
                value={formData.salaryInfo.allowances}
                onChange={(e) => handleInputChange('salaryInfo.allowances', parseInt(e.target.value) || 0)}
                placeholder="Enter allowances"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.salaryInfo.paymentMethod} onValueChange={(value) => handleInputChange('salaryInfo.paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Total Salary</div>
              <div className="text-lg font-bold">
                ৳{(formData.salaryInfo.basic + (formData.salaryInfo.allowances || 0)).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Updating...' : 'Update Teacher'}
        </Button>
      </div>
    </div>
  );
}