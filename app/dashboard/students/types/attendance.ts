import type {
    AttendanceStudent,
    AttendanceStaff,
    AttendanceStatus,
    Student,
    Session,
    Batch
} from '@prisma/client';
import { PersonalInfo } from './student';

export type { AttendanceStudent, AttendanceStaff, AttendanceStatus };

export interface AttendanceFormData {
    studentId: string;
    sessionId: string;
    batchId: string;
    date: string;
    status: AttendanceStatus;
    markedBy: string;
}

export type AttendanceStudentWithRelations = AttendanceStudent & {
    student: Student;
    session: Session;
    batch: Batch;
};

export type AttendanceTableData = AttendanceStudent & {
    student: {
        studentId: string;
        personal: PersonalInfo;
        class: { name: string };
        batch: { name: string };
    };
};

export interface AttendanceFilters {
    sessionId?: string;
    batchId?: string;
    date?: string;
    status?: AttendanceStatus;
    search?: string;
}
