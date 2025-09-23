import type { Student, StudentStatus, StudentNote, Session, Class, Batch, Section, Teacher, Collection, AttendanceStudent } from '@prisma/client';

export type { Student, StudentStatus, StudentNote };

export interface PersonalInfo {
  nameBn: string;
  nameEn: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  photoUrl?: string;
}

export interface GuardianInfo {
  fatherName: string;
  motherName: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  contact: {
    smsNo: string;
    altNo?: string;
    email?: string;
  };
}

export interface AddressInfo {
  present: string;
  permanent?: string;
}

export interface StudentFormData {
  studentId: string;
  sessionId: string;
  classId: string;
  batchId: string;
  sectionId: string;
  roll: string;
  personal: PersonalInfo;
  guardian: GuardianInfo;
  address: AddressInfo;
  status: StudentStatus;
  disableReason?: string;
  continuityTick: boolean;
}

export type StudentWithRelations = Student & {
  session: Session;
  class: Class;
  batch: Batch;
  section: Section;
  notes: (StudentNote & { staff: Teacher })[];
  collections: Collection[];
  attendanceStudent: AttendanceStudent[];
};

export type StudentTableData = Student & {
  session: { year: string };
  class: { name: string };
  batch: { name: string };
  section: { name: string };
};

export interface StudentFilters {
  sessionId?: string;
  classId?: string;
  batchId?: string;
  sectionId?: string;
  status?: StudentStatus;
  search?: string;
}