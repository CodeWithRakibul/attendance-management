// Import types for re-export and alias creation
import type { EmployeeFormData } from '@/lib/types';

// Re-export all types from the centralized types file
export type {
  Employee,
  User,
  Shift,
  EmployeeType,
  EmployeeStatus,
  EmployeeFormData,
  EmployeeWithRelations,
  EmployeeWithUser,
  EmployeeTableData,
  EmployeeFilters,
  UserFormData,
  ShiftFormData,
  ApiResponse,
  PaginatedResponse,
  SelectOption,
  SortConfig,
  SortDirection
} from '@/lib/types';

// Legacy alias for backward compatibility
export type EmployeeData = EmployeeFormData;

// Re-export constants from centralized location
export { employeeTypes, employeeStatuses, employeeTypeOptions, employeeStatusOptions } from '@/lib/employee-constants';
