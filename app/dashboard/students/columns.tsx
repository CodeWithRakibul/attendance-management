'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconEdit, IconEye, IconArrowUp, IconArrowDown, IconArrowsSort } from '@tabler/icons-react';
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
      const personal = student.personal as any;
      const name = personal?.nameEn || 'Unknown';
      const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
      
      return (
        <Avatar className="h-10 w-10 border-2 border-blue-200">
          <AvatarImage src={personal?.photoUrl} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'studentId',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Student ID
          {column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <IconArrowsSort className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
        {row.getValue('studentId')}
      </div>
    ),
  },
  {
    accessorKey: 'personal.nameEn',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Name
          {column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <IconArrowsSort className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const student = row.original;
      const personal = student.personal as any;
      return (
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">{personal?.nameEn}</div>
          {personal?.nameBn && (
            <div className="text-sm text-blue-600 font-medium">{personal.nameBn}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'class.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Class
          {column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <IconArrowsSort className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="space-y-1">
          <div className="font-semibold text-green-700 bg-green-50 px-2 py-1 rounded text-sm">
            {student.class.name}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="bg-orange-100 text-orange-700 px-1 rounded">{student.batch.name}</span>
            <span>•</span>
            <span className="bg-purple-100 text-purple-700 px-1 rounded">Sec {student.section.name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'roll',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Roll
          {column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <IconArrowsSort className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-bold text-lg text-center bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
        {row.getValue('roll')}
      </div>
    ),
  },
  {
    accessorKey: 'guardian.fatherName',
    header: 'Father Name',
    cell: ({ row }) => {
      const student = row.original;
      const guardian = student.guardian as any;
      return (
        <div className="space-y-1">
          <div className="font-medium text-gray-800">{guardian?.fatherName}</div>
          <div className="text-sm text-blue-600 font-mono">{guardian?.contact?.smsNo}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Status
          {column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <IconArrowsSort className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Date of Birth
          {column.getIsSorted() === "desc" ? (
            <IconArrowDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <IconArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <IconArrowsSort className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const student = row.original;
      const personal = student.personal as any;
      const dob = personal?.dob;
      if (!dob) return '-';
      return (
        <div className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">
          {new Date(dob).toLocaleDateString('en-GB')}
        </div>
      );
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