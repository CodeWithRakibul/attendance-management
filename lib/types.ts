import { 
  User, 
  Device, 
  Employee, 
  Shift, 
  EmployeeShift, 
  DeviceConnection,
  EmployeeType,
  EmployeeStatus 
} from '@prisma/client';

// Re-export Prisma types
export type { 
  User, 
  Device, 
  Employee, 
  Shift, 
  EmployeeShift, 
  DeviceConnection,
  EmployeeType,
  EmployeeStatus 
};

// Extended types with relations
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

// Form data types (for creating/updating)
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

// Table data types (for display)
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

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and search types
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

// Sort types
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// Common utility types
export type SelectOption<T = string> = {
  value: T;
  label: string;
};

export type DateRange = {
  from: Date;
  to: Date;
};

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