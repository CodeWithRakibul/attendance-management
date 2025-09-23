import type {
    Teacher,
    TeacherStatus,
    TeacherLeave,
    LeaveType,
    LeaveStatus,
    StudentNote,
    Session
} from '@prisma/client';
import { AddressInfo, PersonalInfo } from './student';

export type { Teacher, TeacherStatus, TeacherLeave, LeaveType, LeaveStatus };

export interface ContactInfo {
    mobile: string;
    email?: string;
    facebook?: string;
}

export interface SalaryInfo {
    basicSalary: number;
    allowances?: Record<string, number>;
    advanceTaken?: number;
}

export interface TeacherFormData {
    staffId: string;
    sessionId: string;
    designation: string;
    subjects: string[];
    qualification?: string;
    experience?: string;
    personal: PersonalInfo;
    contact: ContactInfo;
    address: AddressInfo;
    salaryInfo: SalaryInfo;
    status: TeacherStatus;
}

export type TeacherWithRelations = Teacher & {
    session: Session;
    leaves: TeacherLeave[];
    notes: StudentNote[];
};

export type TeacherTableData = Teacher & {
    session: { year: string };
};

export interface TeacherFilters {
    sessionId?: string;
    designation?: string;
    status?: TeacherStatus;
    search?: string;
}

export interface TeacherLeaveFormData {
    teacherId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
}
