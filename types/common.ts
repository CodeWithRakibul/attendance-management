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

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export type SelectOption<T = string> = {
  value: T;
  label: string;
};

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DashboardSummary {
  totalStudents: number;
  activeTeachers: number;
  todayAttendance: number;
  pendingFees: number;
}