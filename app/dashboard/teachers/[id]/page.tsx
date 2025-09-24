import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconEdit, IconArrowLeft, IconPhone, IconMail, IconMapPin, IconCalendar, IconUser, IconBriefcase } from '@tabler/icons-react';
import Link from 'next/link';
import { getTeacher } from '@/queries';

interface TeacherDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherDetailsPage({ params }: TeacherDetailsPageProps) {
  const id = (await (params)).id
  const teacherData = await getTeacher(id);

  if (!teacherData) {
    notFound();
  }

  const teacher = {
    id: teacherData.id,
    staffId: teacherData.staffId,
    personal: teacherData.personal as any,
    contact: teacherData.contact as any,
    address: teacherData.address as any,
    designation: teacherData.designation,
    subjects: teacherData.subjects as string[],
    qualification: teacherData.qualification || '',
    experience: teacherData.experience || '',
    salaryInfo: teacherData.salaryInfo as any,
    status: teacherData.status,
    createdAt: teacherData.createdAt
  };

  const initials = teacher.personal?.nameEn
    ?.split(' ')
    .map((n: string) => n.charAt(0))
    .join('')
    .toUpperCase() || 'T';

  return (
    <div className="flex-1 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/teachers">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to Teachers
            </Link>
          </Button>
        </div>
        <Button asChild>
          <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit Teacher
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Profile Card */}
        <Card className="md:col-span-1 h-fit sticky top-6">
          <CardHeader className="text-center pb-4">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarImage src={teacher.personal?.photoUrl} alt={teacher.personal?.nameEn} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{teacher.personal?.nameEn}</CardTitle>
            {teacher.personal?.nameBn && (
              <p className="text-muted-foreground text-lg">{teacher.personal.nameBn}</p>
            )}
            <Badge variant={teacher.status === 'ACTIVE' ? 'default' : teacher.status === 'INACTIVE' ? 'secondary' : 'destructive'} className="mt-2">
              {teacher.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <IconUser className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Teacher ID</p>
                  <p className="font-medium">{teacher.staffId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <IconBriefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Designation</p>
                  <p className="font-medium">{teacher.designation}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <IconCalendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(teacher.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <IconPhone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Mobile</p>
                  <p className="font-medium">{teacher.contact?.mobile || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <IconMail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{teacher.contact?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Subjects</p>
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.slice(0, 3).map((subject, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {subject}
                  </Badge>
                ))}
                {teacher.subjects.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{teacher.subjects.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Cards */}
        <div className="md:col-span-3 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p>{teacher.personal?.dob ? new Date(teacher.personal.dob).toLocaleDateString() : 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p>{teacher.personal?.gender || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                <p>{teacher.personal?.bloodGroup || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Qualification</label>
                <p>{teacher.qualification}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Experience</label>
                <p>{teacher.experience || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <IconPhone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                  <p>{teacher.contact?.mobile || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{teacher.contact?.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-start space-x-2">
                  <IconMapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Present Address</label>
                      <p>{teacher.address?.present || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Permanent Address</label>
                      <p>{teacher.address?.permanent || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subjects</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {teacher.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Basic Salary</label>
                <p className="text-lg font-semibold">৳{teacher.salaryInfo?.basicSalary?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Allowances</label>
                <p className="text-lg font-semibold">৳{teacher.salaryInfo?.allowances?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Salary</label>
                <p className="text-xl font-bold text-primary">
                  ৳{((teacher.salaryInfo?.basicSalary || 0) + (teacher.salaryInfo?.allowances || 0)).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}