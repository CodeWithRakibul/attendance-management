import { Employee, User, Shift, EmployeeType, EmployeeStatus } from '@prisma/client';

// Base employee form data interface
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  designation: string;
  birthDate: Date | undefined;
  joiningDate: Date | undefined;
  type: EmployeeType;
  status: EmployeeStatus;
  image: string;
  deviceUserId: string;
}

// Employee data type alias for dialogs and forms (without id)
export type EmployeeData = EmployeeFormData;

// Employee with relations type (from database queries)
export type EmployeeWithRelations = Employee & {
  user: User;
  employeeShifts: Array<{
    shift: Shift;
  }>;
};

// Employee data type for table display (includes all database fields)
export type EmployeeTableData = {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  designation: string | null;
  birthDate: Date | null;
  email: string;
  phone: string | null;
  address: string | null;
  joiningDate: Date | null;
  type: EmployeeType;
  status: EmployeeStatus;
  deviceUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  shifts: Array<{
    shift: {
      id: number;
      name: string;
      checkInTime: string;
      checkOutTime: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
};

// Employee constants
export const employeeTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PERMANENT", label: "Permanent" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
  { value: "TEMPORARY", label: "Temporary" },
] as const;

export const employeeStatuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "TERMINATED", label: "Terminated" },
  { value: "ON_LEAVE", label: "On Leave" },
  { value: "RESIGNED", label: "Resigned" },
] as const;