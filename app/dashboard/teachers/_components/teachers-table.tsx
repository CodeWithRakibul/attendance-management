'use client';

import { DataTable } from '@/components/Table/data-table';
import { teachersColumns } from './columns';
import { Teacher } from './columns';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface TeachersTableProps {
  teachers: Teacher[];
}

export function TeachersTable({ teachers }: TeachersTableProps) {
  // Extract unique values for filters
  const router = useRouter();
  const designations = Array.from(new Set(teachers.map(t => t.designation))).filter(Boolean);
  const qualifications = Array.from(new Set(teachers.map(t => t.qualification))).filter(Boolean);

  const filters = [
    {
      columnId: 'designation',
      title: 'Designation',
      options: designations.map(d => ({ label: d, value: d }))
    },
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
        { label: 'Disabled', value: 'DISABLED' }
      ]
    },
    {
      columnId: 'qualification',
      title: 'Qualification',
      options: qualifications.map(q => ({ label: q, value: q }))
    }
  ];

  return (
    <DataTable
      columns={teachersColumns()}
      data={teachers}
      enableSearch={true}
      searchPlaceholder="Search teachers..."
      enablePagination={true}
      pageSize={10}
      createIcon={<IconPlus className="size-4" />}
      onCreateNew={() => router.push("/dashboard/teachers/create")}
      showCreateButton
      createNewLabel='Add Teacher'
      filters={filters}
    />
  );
}