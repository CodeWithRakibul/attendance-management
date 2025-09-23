'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  IconUser, 
  IconPhone, 
  IconMail, 
  IconCalendar, 
  IconMapPin, 
  IconSchool,
  IconCreditCard,
  IconNotes,
  IconUsers,
  IconGenderMale,
  IconGenderFemale,
  IconDroplet,
  IconBuildingBank
} from '@tabler/icons-react';
import { StudentTableData } from '../types/student';

interface StudentDetailsDialogProps {
  student: StudentTableData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({ student, open, onOpenChange }: StudentDetailsDialogProps) {
  if (!student) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'GRADUATED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DROPPED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'MALE':
        return <IconGenderMale className="h-4 w-4 text-blue-600" />;
      case 'FEMALE':
        return <IconGenderFemale className="h-4 w-4 text-pink-600" />;
      default:
        return <IconUser className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {(() => {
              const personal = student.personal as any;
              const nameEn = personal?.nameEn || '';
              const nameBn = personal?.nameBn || '';
              const photoUrl = personal?.photoUrl;
              
              return (
                <>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={photoUrl || `/api/placeholder/150/150`} alt={nameEn} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                      {nameEn ? nameEn.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'ST'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xl font-semibold">{nameEn}</div>
                    {nameBn && (
                      <div className="text-sm text-muted-foreground">{nameBn}</div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        ID: {student.studentId}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(student.status)}`}>
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogTitle>
          <DialogDescription>
            Complete student information and academic details
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconUser className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const personal = student.personal as any;
                const guardian = student.guardian as any;
                const dob = personal?.dob;
                const gender = personal?.gender || 'Not specified';
                const bloodGroup = personal?.bloodGroup;
                const fatherName = guardian?.fatherName;
                const motherName = guardian?.motherName;
                
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                        <p className="text-sm">{fatherName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                        <p className="text-sm">{motherName || 'Not provided'}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <IconCalendar className="h-3 w-3" />
                          Date of Birth
                        </label>
                        <p className="text-sm">{dob ? formatDate(new Date(dob)) : 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          {getGenderIcon(gender)}
                          Gender
                        </label>
                        <p className="text-sm">{gender}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <IconDroplet className="h-3 w-3" />
                          Blood Group
                        </label>
                        <p className="text-sm">{bloodGroup || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Religion</label>
                        <p className="text-sm">Not provided</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconPhone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const guardian = student.guardian as any;
                const contact = guardian?.contact || {};
                const phone = contact?.smsNo;
                const altPhone = contact?.altNo;
                const email = contact?.email;
                
                return (
                  <>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <IconPhone className="h-3 w-3" />
                        Phone Number
                      </label>
                      <p className="text-sm">{phone || 'Not provided'}</p>
                      {altPhone && (
                        <p className="text-xs text-muted-foreground">Alt: {altPhone}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <IconMail className="h-3 w-3" />
                        Email Address
                      </label>
                      <p className="text-sm">{email || 'Not provided'}</p>
                    </div>
                  </>
                );
              })()}

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconMapPin className="h-3 w-3" />
                  Address
                </label>
                {(() => {
                  const address = student.address as any;
                  const present = address?.present;
                  const permanent = address?.permanent;
                  
                  return (
                    <div className="space-y-1">
                      <p className="text-sm">{present || 'Not provided'}</p>
                      {permanent && permanent !== present && (
                        <p className="text-xs text-muted-foreground">Permanent: {permanent}</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconSchool className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Session</label>
                  <p className="text-sm">{student.session?.year || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Class</label>
                  <p className="text-sm">{student.class?.name || 'Not assigned'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Batch</label>
                  <p className="text-sm">{student.batch?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Section</label>
                  <p className="text-sm">{student.section?.name || 'Not assigned'}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                  <p className="text-sm">{student.rollNumber || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration Number</label>
                  <p className="text-sm">{student.registrationNumber || 'Not assigned'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconCalendar className="h-3 w-3" />
                  Admission Date
                </label>
                <p className="text-sm">{formatDate(student.admissionDate)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconUsers className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <IconSchool className="h-3 w-3" />
                  Previous School
                </label>
                <p className="text-sm">{student.previousSchool || 'Not provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Guardian's Occupation</label>
                  <p className="text-sm">{student.guardianOccupation || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <IconCreditCard className="h-3 w-3" />
                    Monthly Income
                  </label>
                  <p className="text-sm">
                    {student.monthlyIncome 
                      ? `৳${student.monthlyIncome.toLocaleString()}` 
                      : 'Not provided'
                    }
                  </p>
                </div>
              </div>

              {student.notes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <IconNotes className="h-3 w-3" />
                      Additional Notes
                    </label>
                    <p className="text-sm bg-gray-50 p-3 rounded-md mt-1">{student.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}