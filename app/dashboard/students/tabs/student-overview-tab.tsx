'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconUser, IconCalendar, IconMapPin, IconPhone, IconMail, IconBook, IconGenderMale, IconGenderFemale, IconDroplet } from '@tabler/icons-react';

interface StudentOverviewTabProps {
  student: any;
}

export function StudentOverviewTab({ student }: StudentOverviewTabProps) {
  if (!student) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getGenderIcon = (gender: string) => {
    return gender.toLowerCase() === 'male' ? IconGenderMale : IconGenderFemale;
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name (English)</label>
              <p className="text-sm font-medium">{student.personal.nameEn}</p>
            </div>
            
            {student.personal.nameBn && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Full Name (Bangla)</label>
                <p className="text-sm font-medium">{student.personal.nameBn}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <div className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formatDate(student.personal.dob)}</p>
                <Badge variant="outline" className="text-xs">
                  {calculateAge(student.personal.dob)} years old
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <div className="flex items-center gap-2">
                {(() => {
                  const GenderIcon = getGenderIcon(student.personal.gender);
                  return <GenderIcon className="h-4 w-4 text-muted-foreground" />;
                })()}
                <p className="text-sm capitalize">{student.personal.gender}</p>
              </div>
            </div>
            
            {student.personal.bloodGroup && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                <div className="flex items-center gap-2">
                  <IconDroplet className="h-4 w-4 text-red-500" />
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {student.personal.bloodGroup}
                  </Badge>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Student Status</label>
              <Badge variant={student.status === 'ACTIVE' ? 'default' : student.status === 'INACTIVE' ? 'secondary' : 'destructive'}>
                {student.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBook className="h-5 w-5" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Student ID</label>
              <p className="text-sm font-mono font-medium">{student.studentId}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
              <p className="text-sm font-medium">{student.roll}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Session</label>
              <p className="text-sm">{student.session?.year || 'N/A'}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Class</label>
              <p className="text-sm font-medium">{student.class.name}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Batch</label>
              <p className="text-sm">{student.batch.name}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Section</label>
              <p className="text-sm">{student.section.name}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Present Address</label>
              <p className="text-sm">{student.address?.present || 'Not provided'}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Permanent Address</label>
              <p className="text-sm">{student.address?.permanent || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Registration Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
              <p className="text-sm">{formatDate(student.createdAt)}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="text-sm">{formatDate(student.updatedAt || student.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}