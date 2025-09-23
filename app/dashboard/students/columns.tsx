'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconEdit, IconEye } from '@tabler/icons-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconDots } from '@tabler/icons-react';

export type Student = {
  id: string;
  studentId: string;
  personal: {
    nameEn: string;
    nameBn?: string;
    dob: string;
    gender: string;
    photoUrl?: string;
  };
  guardian: {
    fatherName: string;
    contact: {
      smsNo: string;
    };
  };
  status: 'ACTIVE' | 'INACTIVE' | 'DISABLED';
  class: {
    name: string;
  };
  batch: {
    name: string;
  };
  section: {
    name: string;
  };
  roll: string;
  createdAt: string;
};

export const studentsColumns = (onEdit: (student: Student) => void): ColumnDef<Student>[] => [
  {
    accessorKey: 'personal.photoUrl',
    header: '',
    cell: ({ row }) => {
      const student = row.original;
      const name = student.personal.nameEn;
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
      
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={student.personal.photoUrl} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'studentId',
    header: 'Student ID',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('studentId')}</div>
    ),
  },
  {
    accessorKey: 'personal.nameEn',
    header: 'Name',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div>
          <div className="font-medium">{student.personal.nameEn}</div>
          {student.personal.nameBn && (
            <div className="text-sm text-muted-foreground">{student.personal.nameBn}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'class.name',
    header: 'Class',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="text-sm">
          <div>{student.class.name}</div>
          <div className="text-muted-foreground">
            {student.batch.name} • {student.section.name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'roll',
    header: 'Roll',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('roll')}</div>
    ),
  },
  {
    accessorKey: 'guardian.fatherName',
    header: 'Father Name',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div>
          <div className="font-medium">{student.guardian.fatherName}</div>
          <div className="text-sm text-muted-foreground">{student.guardian.contact.smsNo}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'ACTIVE' ? 'default' : status === 'INACTIVE' ? 'secondary' : 'destructive'}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'personal.dob',
    header: 'Date of Birth',
    cell: ({ row }) => {
      const dob = row.getValue('personal.dob') as string;
      return new Date(dob).toLocaleDateString();
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(student)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconEye className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];