import { employeeQueries } from '@/queries/employees';
import EmployeesTable from './table';
import { EmployeeWithRelations } from '@/types/employee';

export default async function EmployeesPage() {
  const employees = await employeeQueries.getAll() as unknown as EmployeeWithRelations[];

  console.log(employees);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
      <EmployeesTable employees={employees} />
    </div>
  )
}
