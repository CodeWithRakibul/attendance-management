import type { Class, Batch, Section, Session, Student } from '@prisma/client';

export type { Class, Batch, Section };

export interface ClassFormData {
    name: string;
    sessionId: string;
}

export interface BatchFormData {
    name: string;
    classId: string;
    sessionId: string;
    timeSlot?: string;
}

export interface SectionFormData {
    name: string;
    classId: string;
    sessionId: string;
}

export type ClassWithRelations = Class & {
    session: Session;
    students: Student[];
    batches: Batch[];
    sections: Section[];
};
