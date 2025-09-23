import React from "react";
import EmployeesTable from "@/app/dashboard/employees/table";
import { employeeQueries } from "@/queries/employees";
import { EmployeeWithRelations } from "@/types/employee";

export default async function EmployeeTabContent() {
  const employees = await employeeQueries.getAll() as unknown as EmployeeWithRelations[];
  return (
    <EmployeesTable employees={employees} enableFilter={false} enableSearch={false} showCreateButton={false} />
  )
}
