import { employeeQueries } from '@/queries/employees';
import EmployeesTable from './table';
import { EmployeeWithRelations } from '@/types/employee';

// Ensure this page always fetches fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EmployeesPage() {
  const employees = await employeeQueries.getAll() as unknown as EmployeeWithRelations[];

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
      <EmployeesTable employees={employees} />
    </div>
  )
}
