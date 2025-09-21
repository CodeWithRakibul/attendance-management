import { employeeQueries } from '@/queries/employees';
import EmployeesTable from './table';
import { Employee, User, Shift } from '@prisma/client';

// Type for the employee data with relations (matching the query structure)
type EmployeeWithRelations = Employee & {
    user: User;
    employeeShifts: Array<{
        shift: Shift;
    }>;
};

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
