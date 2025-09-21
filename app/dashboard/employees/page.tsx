import { employeeQueries } from '@/queries/employees';
import EmployeesTable from './table';

export default async function EmployeesPage() {
  const employees = await employeeQueries.getAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
      </div>
      <EmployeesTable employees={employees} />
    </div>
  )
}
