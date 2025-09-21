"use client";

import { DataTable } from "@/components/Table/data-table";
import { columns } from "./columns";
import { Employee } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";


interface Props {
    employees: Employee[];
    enableSearch?: boolean;
    enableFilter?: boolean;
    showCreateButton?: boolean;
}

export default function EmployeesTable({ employees, enableSearch = true, enableFilter = true, showCreateButton = true }: Props) {

    const statusFilters = enableFilter ? [
        {
            columnId: "status",
            title: "Status",
            options: [] // Options will be generated dynamically from data
        }
    ] : [];

    return (
        <DataTable
            data={employees}
            columns={columns as ColumnDef<any>[]}
            enableRowSelection
            enableSearch={enableSearch}
            searchPlaceholder="Search employees..."
            filters={statusFilters}
            showCreateButton={showCreateButton}
            createNewLabel="Add Employee"
            onCreateNew={() => console.log('Create new employee')}
        />
    )
}
