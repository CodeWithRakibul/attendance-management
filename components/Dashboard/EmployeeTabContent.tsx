import EmployeesTable from "@/app/dashboard/employees/table";
import { employeeQueries } from "@/queries/employees";

export default async function EmployeeTabContent() {
  const employees = await employeeQueries.getAll();
  return (
    <EmployeesTable employees={employees} enableFilter={false} enableSearch={false} showCreateButton={false} />
  )
}
