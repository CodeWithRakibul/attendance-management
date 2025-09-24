import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconUsers } from '@tabler/icons-react';
import { TeachersTable } from './teachers-table';
import { Teacher } from './columns';
import { getTeachers } from '@/queries';

export default async function TeachersPage() {
  const teachersData = await getTeachers();

  // Transform Prisma data to match Teacher type
  const teachers: Teacher[] = teachersData.map(teacher => ({
    id: teacher.id,
    staffId: teacher.staffId,
    personal: {
      nameEn: (teacher.personal as any)?.nameEn || '',
      nameBn: (teacher.personal as any)?.nameBn,
      dob: (teacher.personal as any)?.dob || '',
      gender: (teacher.personal as any)?.gender || '',
      photoUrl: (teacher.personal as any)?.photoUrl
    },
    contact: {
      mobile: (teacher.contact as any)?.mobile || '',
      email: (teacher.contact as any)?.email
    },
    designation: teacher.designation,
    subjects: teacher.subjects as string[],
    qualification: teacher.qualification || '',
    salaryInfo: {
      basicSalary: (teacher.salaryInfo as any)?.basic || 0,
      allowances: (teacher.salaryInfo as any)?.allowances
    },
    status: teacher.status as 'ACTIVE' | 'INACTIVE' | 'DISABLED',
    createdAt: teacher.createdAt.toISOString()
  }));

  return (
    <div className="flex-1 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className='!gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className='!gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22</div>
            <p className="text-xs text-muted-foreground">91.7% active rate</p>
          </CardContent>
        </Card>

        <Card className='!gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card className='!gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Experience</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2</div>
            <p className="text-xs text-muted-foreground">Years</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <Suspense fallback={<div>Loading teachers...</div>}>
            <TeachersTable teachers={teachers} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}