// Import specific types to avoid circular dependency
import type { 
  User, Employee, Shift, EmployeeShift, Device, DeviceConnection,
  EmployeeType, EmployeeStatus, ApiResponse, PaginatedResponse,
  SelectOption, SortConfig, SortDirection, DateRange
} from '@prisma/client';

// Re-export Prisma types
export type { 
  User, Employee, Shift, EmployeeShift, Device, DeviceConnection,
  EmployeeType, EmployeeStatus
};

// Re-export common types
export type { ApiResponse, PaginatedResponse, SelectOption, SortConfig, SortDirection, DateRange } from '@/types/common';

// Legacy employee system types (keeping for backward compatibility)
export type UserWithEmployees = User & {
  employees: Employee[];
};

export type EmployeeWithRelations = Employee & {
  user: User;
  employeeShifts: (EmployeeShift & {
    shift: Shift;
  })[];
};

export type EmployeeWithUser = Employee & {
  user: User;
};

export type ShiftWithEmployees = Shift & {
  employees: (EmployeeShift & {
    employee: Employee;
  })[];
};

export type DeviceWithConnections = Device & {
  connections: DeviceConnection[];
};

// Legacy form data types
export interface UserFormData {
  name: string;
  email: string;
}

export interface EmployeeFormData {
  userId: number;
  firstName: string;
  lastName: string;
  image?: string | null;
  designation?: string | null;
  birthDate?: Date | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  joiningDate?: Date | null;
  type: EmployeeType;
  status: EmployeeStatus;
  deviceUserId?: string | null;
}

export interface ShiftFormData {
  name: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface DeviceFormData {
  name: string;
  ip: string;
  port: number;
  status?: string;
}

// Legacy table data types
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

export type DeviceTableData = Device & {
  connections: DeviceConnection[];
  _count?: {
    connections: number;
  };
};

export type ShiftTableData = Shift & {
  employees: Array<{
    employee: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  _count?: {
    employees: number;
  };
};

// Legacy filter types
export interface EmployeeFilters {
  type?: EmployeeType;
  status?: EmployeeStatus;
  search?: string;
  designation?: string;
}

export interface DeviceFilters {
  status?: string;
  search?: string;
}

export interface ShiftFilters {
  search?: string;
}

// ZKTeco device types
export interface ZKTecoUser {
  uid: number;
  userId: string;
  name: string;
  password?: string;
  role: number;
  cardno?: string;
}

export interface ZKTecoAttendance {
  uid: number;
  userId: string;
  timestamp: Date;
  type: number; // 0: check-in, 1: check-out
}

export interface DeviceConnectionStatus {
  connected: boolean;
  lastConnected?: Date;
  error?: string;
}