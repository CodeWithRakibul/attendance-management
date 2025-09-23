'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconUsers, IconPhone, IconMail, IconBriefcase, IconUser } from '@tabler/icons-react';

interface StudentGuardianTabProps {
  student: any;
}

export function StudentGuardianTab({ student }: StudentGuardianTabProps) {
  if (!student) return null;

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="space-y-6">
      {/* Father Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Father Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
              <p className="text-sm font-medium">{student.guardian.fatherName}</p>
            </div>
            
            {student.guardian.occupations?.father && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                <div className="flex items-center gap-2">
                  <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{student.guardian.occupations.father}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mother Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Mother Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
              <p className="text-sm font-medium">{student.guardian.motherName || 'Not provided'}</p>
            </div>
            
            {student.guardian.occupations?.mother && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                <div className="flex items-center gap-2">
                  <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{student.guardian.occupations.mother}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPhone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* Primary Contact */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Primary Contact</h4>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCall(student.guardian.contact.smsNo)}
                  >
                    <IconPhone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">SMS Number</label>
                  <div className="flex items-center gap-2">
                    <IconPhone className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-mono">{student.guardian.contact.smsNo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Contact */}
            {student.guardian.contact.altNo && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Alternative Contact</h4>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCall(student.guardian.contact.altNo)}
                    >
                      <IconPhone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Alternative Number</label>
                  <div className="flex items-center gap-2">
                    <IconPhone className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-mono">{student.guardian.contact.altNo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Contact */}
            {student.guardian.contact.email && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Email Contact</h4>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEmail(student.guardian.contact.email)}
                    >
                      <IconMail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <div className="flex items-center gap-2">
                    <IconMail className="h-4 w-4 text-purple-600" />
                    <p className="text-sm">{student.guardian.contact.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Emergency Contact Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Primary contact number will be used for SMS notifications and emergency calls</p>
            <p>• Alternative contact will be used if primary contact is unavailable</p>
            <p>• Email will be used for official communications and reports</p>
            <p>• Please ensure all contact information is up to date</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}