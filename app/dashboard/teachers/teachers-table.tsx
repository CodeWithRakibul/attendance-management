'use client';

import { DataTable } from '@/components/ui/data-table';
import { teachersColumns } from './columns';

interface TeachersTableProps {
  teachers: any[];
}

export function TeachersTable({ teachers }: TeachersTableProps) {
  return (
    <DataTable
      columns={teachersColumns()}
      data={teachers}
      searchKey="staffId"
      searchPlaceholder="Search teachers..."
    />
  );
}