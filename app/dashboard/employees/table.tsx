'use client';

import { useState } from 'react';
import { DataTable } from '@/components/Table/data-table';
import { createColumns } from './columns';
import { Employee, User, Shift } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { EmployeeDialog } from './employee-dialog';
import { EmployeeDetailsDialog } from './employee-details-dialog';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { deleteEmployee, deleteMultipleEmployees } from './actions';
import { toast } from 'sonner';

// Type for the employee data with relations (matching the query structure)
type EmployeeWithRelations = Employee & {
    user: User;
    employeeShifts: Array<{
        shift: Shift;
    }>;
};

// Type that matches the columns definition
type EmployeeData = {
    id: number
    userId: number
    firstName: string
    lastName: string
    image: string | null
    designation: string | null
    birthDate: Date | null
    email: string
    phone: string | null
    joiningDate: Date | null
    type: "FULL_TIME" | "PERMANENT" | "INTERN" | "PART_TIME" | "CONTRACT" | "TEMPORARY"
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED" | "ON_LEAVE" | "RESIGNED"
    deviceUserId: string | null
    createdAt: Date
    updatedAt: Date
    user: {
        id: number
        name: string
        email: string
        createdAt: Date
        updatedAt: Date
    }
    shifts: Array<{
        shift: {
            id: number
            name: string
            checkInTime: string
            checkOutTime: string
            createdAt: Date
            updatedAt: Date
        }
    }>
}

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
    
    // Confirmation dialog states
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleteMultipleConfirmOpen, setIsDeleteMultipleConfirmOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeWithRelations | null>(null);
    const [selectedIdsToDelete, setSelectedIdsToDelete] = useState<string[]>([]);

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

    const handleEdit = (employee: EmployeeData) => {
        setSelectedEmployee(employee as unknown as EmployeeWithRelations);
        setIsEditDialogOpen(true);
    };

    const handleViewDetails = (employee: EmployeeData) => {
        setSelectedEmployeeForDetails(employee as unknown as EmployeeWithRelations);
        setIsDetailsDialogOpen(true);
    };

    const handleDeleteSelected = async (selectedIds: string[]) => {
        setSelectedIdsToDelete(selectedIds);
        setIsDeleteMultipleConfirmOpen(true);
    };

    const confirmDeleteSelected = async () => {
        try {
            const result = await deleteMultipleEmployees(selectedIdsToDelete.map(id => parseInt(id)));
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete employees');
            }

            toast.success(`Successfully deleted ${selectedIdsToDelete.length} employee${selectedIdsToDelete.length > 1 ? 's' : ''}`);
            setIsDeleteMultipleConfirmOpen(false);
            setSelectedIdsToDelete([]);
        } catch (error) {
            console.error('Error deleting employees:', error);
            toast.error('Failed to delete employees. Please try again.');
        }
    };

    const handleDeleteSingle = (employee: EmployeeData) => {
        setEmployeeToDelete(employee as unknown as EmployeeWithRelations);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteSingle = async () => {
        if (!employeeToDelete) return;

        try {
            const result = await deleteEmployee(employeeToDelete.id);
            
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete employee');
            }

            toast.success('Employee deleted successfully');
            setIsDeleteConfirmOpen(false);
            setEmployeeToDelete(null);
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error('Failed to delete employee. Please try again.');
        }
    };

    const columns = createColumns(handleEdit, handleViewDetails, handleDeleteSingle);

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
                showDeleteButton={true}
                onDeleteSelected={handleDeleteSelected}
                deleteButtonLabel="Delete Selected"
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
            
            {/* Single Delete Confirmation */}
            <AlertDialog
                open={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                title="Delete Employee"
                description={
                    employeeToDelete 
                        ? `Are you sure you want to delete ${employeeToDelete.firstName} ${employeeToDelete.lastName}? This action cannot be undone.`
                        : "Are you sure you want to delete this employee?"
                }
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={confirmDeleteSingle}
                onCancel={() => setEmployeeToDelete(null)}
            />
            
            {/* Multiple Delete Confirmation */}
            <AlertDialog
                open={isDeleteMultipleConfirmOpen}
                onOpenChange={setIsDeleteMultipleConfirmOpen}
                title="Delete Selected Employees"
                description={`Are you sure you want to delete ${selectedIdsToDelete.length} selected employee${selectedIdsToDelete.length > 1 ? 's' : ''}? This action cannot be undone.`}
                confirmText="Delete All"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={confirmDeleteSelected}
                onCancel={() => setSelectedIdsToDelete([])}
            />
        </>
    );
}
