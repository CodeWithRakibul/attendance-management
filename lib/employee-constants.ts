import { EmployeeType, EmployeeStatus } from '@prisma/client';

// Re-export Prisma types for consistency
export { EmployeeType, EmployeeStatus };

// Typed constant arrays for dropdowns and validation - matching exact Prisma schema
export const employeeTypes: EmployeeType[] = [
  'FULL_TIME',
  'PERMANENT',
  'INTERN',
  'PART_TIME',
  'CONTRACT',
  'TEMPORARY'
];

export const employeeStatuses: EmployeeStatus[] = [
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'TERMINATED',
  'ON_LEAVE',
  'RESIGNED'
];

// Type helpers
export type EmployeeTypeOption = {
  value: EmployeeType;
  label: string;
};

export type EmployeeStatusOption = {
  value: EmployeeStatus;
  label: string;
};

export const employeeTypeOptions: EmployeeTypeOption[] = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PERMANENT', label: 'Permanent' },
  { value: 'INTERN', label: 'Intern' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'TEMPORARY', label: 'Temporary' }
];

export const employeeStatusOptions: EmployeeStatusOption[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'TERMINATED', label: 'Terminated' },
  { value: 'ON_LEAVE', label: 'On Leave' },
  { value: 'RESIGNED', label: 'Resigned' }
];