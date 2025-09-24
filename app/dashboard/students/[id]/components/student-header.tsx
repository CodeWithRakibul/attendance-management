import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconEdit, IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface StudentHeaderProps {
  student: {
    studentId: string;
    personal: any;
  };
  onEdit: () => void;
}

export function StudentHeader({ student, onEdit }: StudentHeaderProps) {
  const router = useRouter();
  const personal = student.personal as any;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <IconArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={personal?.photoUrl} alt={personal?.nameEn} />
            <AvatarFallback className="text-lg">
              {personal?.nameEn?.charAt(0) || 'S'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{personal?.nameEn}</h1>
            <p className="text-muted-foreground">{personal?.nameBn}</p>
            <Badge variant="outline">ID: {student.studentId}</Badge>
          </div>
        </div>
      </div>
      <Button onClick={onEdit}>
        <IconEdit className="h-4 w-4 mr-2" />
        Edit
      </Button>
    </div>
  );
}