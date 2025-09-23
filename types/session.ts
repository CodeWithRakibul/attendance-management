import type { Class, Session, SessionStatus, Student, Teacher } from '@prisma/client';

export type { Session, SessionStatus };

export interface SessionFormData {
    year: string;
    status: SessionStatus;
}

export type SessionWithRelations = Session & {
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
};
