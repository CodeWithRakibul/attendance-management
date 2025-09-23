import type { FeeMaster, Collection, FeeType, PaymentMethod, CollectionStatus, Student, Session, Teacher } from '@prisma/client';
import { PersonalInfo } from './student';

export type { FeeMaster, Collection, FeeType, PaymentMethod, CollectionStatus };

export interface FeeMasterFormData {
  sessionId: string;
  name: string;
  amount: number;
  type: FeeType;
  groupId?: string;
  dueDate?: string;
}

export interface CollectionFormData {
  studentId: string;
  sessionId: string;
  feeMasterId: string;
  amount: number;
  method: PaymentMethod;
  collectedBy: string;
}

export type CollectionWithRelations = Collection & {
  student: Student;
  session: Session;
  feeMaster: FeeMaster;
  collector: Teacher;
};

export type CollectionTableData = Collection & {
  student: {
    studentId: string;
    personal: PersonalInfo;
  };
  feeMaster: {
    name: string;
    type: FeeType;
  };
};

export interface CollectionFilters {
  sessionId?: string;
  status?: CollectionStatus;
  method?: PaymentMethod;
  search?: string;
}