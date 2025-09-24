import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconEdit, IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Student } from '@prisma/client';

interface StudentHeaderProps {
  student: Student
}

export function StudentHeader({ student }: StudentHeaderProps) {
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
      <Link href={`/dashboard/students/${student.id}/edit`} className={cn(buttonVariants({ variant: "default" }))} >
        <IconEdit className="size-4" />
        Edit
      </Link>
    </div>
  );
}