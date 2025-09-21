"use client";

import { DataTable } from "@/components/Table/data-table";
import { columns } from "./columns";
import { Employee } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export default function EmployeesTable({ employees }: { employees: Employee[] }) {

    const statusFilters = [
        {
            columnId: "status",
            title: "Status",
            options: [] // Options will be generated dynamically from data
        }
    ];

    return (
        <DataTable
            data={employees}
            columns={columns as ColumnDef<any>[]}
            enableRowSelection
            enableSearch
            searchPlaceholder="Search employees..."
            filters={statusFilters}
            showCreateButton
            createNewLabel="Add Employee"
            onCreateNew={() => console.log('Create new employee')}
        />
    )
}
