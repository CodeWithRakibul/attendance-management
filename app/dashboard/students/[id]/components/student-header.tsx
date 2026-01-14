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
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">ID: {student.studentId}</Badge>
              {/* Smart Profile Badge */}
              {(() => {
                const income = (student.guardian as any)?.annualIncome || 0
                let badgeColor = "bg-gray-100 text-gray-800"
                let label = "Standard Profile"

                if (income >= 1000000) {
                  badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-200"
                  label = "Gold Profile"
                } else if (income >= 500000) {
                  badgeColor = "bg-slate-100 text-slate-800 border-slate-200"
                  label = "Silver Profile"
                }

                return (
                  <Badge variant="outline" className={badgeColor}>
                    {label}
                  </Badge>
                )
              })()}
            </div>
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