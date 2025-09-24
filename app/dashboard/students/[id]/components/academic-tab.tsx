import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconSchool } from '@tabler/icons-react';
import { InfoField } from './info-field';

interface AcademicTabProps {
  student: {
    session?: { year: string };
    class?: { name: string };
    batch?: { name: string };
    section?: { name: string };
    roll: string;
    status: string;
  };
}

export function AcademicTab({ student }: AcademicTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconSchool className="h-5 w-5" />
          Academic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoField label="Session" value={student.session?.year} />
        <InfoField label="Class" value={student.class?.name} />
        <InfoField label="Batch" value={student.batch?.name} />
        <InfoField label="Section" value={student.section?.name} />
        <InfoField label="Roll" value={student.roll} />
        <div>
          <label className="text-sm block font-medium">Status</label>
          <Badge>{student.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}