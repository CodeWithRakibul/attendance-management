'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IconPhone, IconMail, IconMapPin, IconCalendar, IconUser, IconBriefcase } from '@tabler/icons-react';

interface TeacherOverviewTabProps {
  teacher: any;
  loading: boolean;
}

export function TeacherOverviewTab({ teacher, loading }: TeacherOverviewTabProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconUser className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-sm">{teacher.personal.nameEn}</p>
              {teacher.personal.nameBn && (
                <p className="text-sm text-muted-foreground">{teacher.personal.nameBn}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <p className="text-sm">{new Date(teacher.personal.dob).toLocaleDateString()}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <p className="text-sm">{teacher.personal.gender}</p>
            </div>
            
            {teacher.personal.bloodGroup && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                <p className="text-sm">{teacher.personal.bloodGroup}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconPhone className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Primary Phone</label>
              <div className="flex items-center justify-between">
                <p className="text-sm">{teacher.contact.smsNo}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCall(teacher.contact.smsNo)}
                >
                  <IconPhone className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {teacher.contact.altNo && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Alternative Phone</label>
                <div className="flex items-center justify-between">
                  <p className="text-sm">{teacher.contact.altNo}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCall(teacher.contact.altNo)}
                  >
                    <IconPhone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {teacher.contact.email && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center justify-between">
                  <p className="text-sm">{teacher.contact.email}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEmail(teacher.contact.email)}
                  >
                    <IconMail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconBriefcase className="mr-2 h-5 w-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Designation</label>
              <p className="text-sm">{teacher.designation}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subjects</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {teacher.subjects.map((subject: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Qualification</label>
              <p className="text-sm">{teacher.qualification}</p>
            </div>
            
            {teacher.experience && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Experience</label>
                <p className="text-sm">{teacher.experience}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Joining Date</label>
              <p className="text-sm flex items-center">
                <IconCalendar className="mr-2 h-4 w-4" />
                {new Date(teacher.joiningDate).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconMapPin className="mr-2 h-5 w-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Present Address</label>
              <p className="text-sm">{teacher.contact.address.present}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Permanent Address</label>
              <p className="text-sm">{teacher.contact.address.permanent}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common actions for this teacher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <IconPhone className="mr-2 h-4 w-4" />
              Call Teacher
            </Button>
            {teacher.contact.email && (
              <Button variant="outline" size="sm">
                <IconMail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            )}
            <Button variant="outline" size="sm">
              <IconCalendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
            <Button variant="outline" size="sm">
              <IconBriefcase className="mr-2 h-4 w-4" />
              Assign Classes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}