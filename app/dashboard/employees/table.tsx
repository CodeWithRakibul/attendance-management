'use client';

import { useState } from 'react';
import { DataTable } from '@/components/Table/data-table';
import { createColumns } from './columns';
import { Employee, User, Shift } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { EmployeeDialog } from './employee-dialog';
import { EmployeeDetailsDialog } from './employee-details-dialog';

// Type for the employee data with relations (matching the query structure)
type EmployeeWithRelations = Employee & {
    user: User;
    employeeShifts: Array<{
        shift: Shift;
    }>;
};

interface Props {
    employees: EmployeeWithRelations[];
    enableSearch?: boolean;
    enableFilter?: boolean;
    showCreateButton?: boolean;
}

export default function EmployeesTable({
    employees,
    enableSearch = true,
    enableFilter = true,
    showCreateButton = true
}: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithRelations | null>(null);
    const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState<EmployeeWithRelations | null>(null);

    const statusFilters = enableFilter
        ? [
              {
                  columnId: 'status',
                  title: 'Active',
                  options: [] // Options will be generated dynamically from data
              },
              {
                  columnId: 'type',
                  title: 'Type',
                  options: [] // Options will be generated dynamically from data
              }
          ]
        : [];

    const handleCreateNew = () => {
        setIsCreateDialogOpen(true);
    };

    const handleEdit = (employee: EmployeeWithRelations) => {
        setSelectedEmployee(employee);
        setIsEditDialogOpen(true);
    };

    const handleViewDetails = (employee: EmployeeWithRelations) => {
        setSelectedEmployeeForDetails(employee);
        setIsDetailsDialogOpen(true);
    };

    const columns = createColumns(handleEdit, handleViewDetails);

    return (
        <>
            <DataTable
                data={employees}
                columns={columns as ColumnDef<EmployeeWithRelations>[]}
                enableRowSelection
                enableSearch={enableSearch}
                searchPlaceholder='Type to Search'
                filters={statusFilters}
                showCreateButton={showCreateButton}
                onCreateNew={showCreateButton ? handleCreateNew : undefined}
            />
            <EmployeeDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                mode='create'
            />
            <EmployeeDialog
                isOpen={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setSelectedEmployee(null);
                }}
                mode='edit'
                employee={selectedEmployee}
            />
            <EmployeeDetailsDialog
                isOpen={isDetailsDialogOpen}
                onClose={() => {
                    setIsDetailsDialogOpen(false);
                    setSelectedEmployeeForDetails(null);
                }}
                employee={selectedEmployeeForDetails}
            />
        </>
    );
}
