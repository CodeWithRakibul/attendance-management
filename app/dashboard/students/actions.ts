'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { StudentFormData, StudentStatus } from '@/types/student';

export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      include: {
        session: true,
        class: true,
        batch: true,
        section: true,
        notes: {
          include: {
            staff: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        collections: {
          include: {
            feeMaster: true,
          },
        },
        attendanceStudent: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return students;
  } catch (error) {
    console.error('Failed to fetch students:', error);
    throw new Error('Failed to fetch students');
  }
}

export async function getStudent(id: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        session: true,
        class: true,
        batch: true,
        section: true,
        notes: {
          include: {
            staff: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        collections: {
          include: {
            feeMaster: true,
            collector: true,
          },
        },
        attendanceStudent: {
          include: {
            batch: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return student;
  } catch (error) {
    console.error('Failed to fetch student:', error);
    throw new Error('Failed to fetch student');
  }
}

export async function createStudent(data: StudentFormData) {
  try {
    const student = await prisma.student.create({
      data: {
        studentId: data.studentId,
        sessionId: data.sessionId,
        classId: data.classId,
        batchId: data.batchId,
        sectionId: data.sectionId,
        roll: data.roll,
        personal: data.personal,
        guardian: data.guardian,
        address: data.address,
        status: (data.status as StudentStatus) || 'ACTIVE',
      },
      include: {
        session: true,
        class: true,
        batch: true,
        section: true,
      },
    });

    revalidatePath('/dashboard/students');
    return { success: true, data: student };
  } catch (error) {
    console.error('Failed to create student:', error);
    return { success: false, error: 'Failed to create student' };
  }
}

export async function updateStudent(id: string, data: Partial<StudentFormData>) {
  try {
    const student = await prisma.student.update({
      where: { id },
      data: {
        ...(data.studentId && { studentId: data.studentId }),
        ...(data.sessionId && { sessionId: data.sessionId }),
        ...(data.classId && { classId: data.classId }),
        ...(data.batchId && { batchId: data.batchId }),
        ...(data.sectionId && { sectionId: data.sectionId }),
        ...(data.roll && { roll: data.roll }),
        ...(data.personal && { personal: data.personal }),
        ...(data.guardian && { guardian: data.guardian }),
        ...(data.address && { address: data.address }),
        ...(data.status && { status: data.status as StudentStatus }),
      },
      include: {
        session: true,
        class: true,
        batch: true,
        section: true,
      },
    });

    revalidatePath('/dashboard/students');
    return { success: true, data: student };
  } catch (error) {
    console.error('Failed to update student:', error);
    return { success: false, error: 'Failed to update student' };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({
      where: { id },
    });

    revalidatePath('/dashboard/students');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete student:', error);
    return { success: false, error: 'Failed to delete student' };
  }
}

export async function addStudentNote(studentId: string, staffId: string, note: string) {
  try {
    const studentNote = await prisma.studentNote.create({
      data: {
        studentId,
        staffId,
        note,
      },
      include: {
        staff: true,
      },
    });

    revalidatePath('/dashboard/students');
    return { success: true, data: studentNote };
  } catch (error) {
    console.error('Failed to add student note:', error);
    return { success: false, error: 'Failed to add student note' };
  }
}

export async function getSessions() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: {
        year: 'desc',
      },
    });
    return sessions;
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    throw new Error('Failed to fetch sessions');
  }
}

export async function getClasses(sessionId?: string) {
  try {
    const classes = await prisma.class.findMany({
      where: sessionId ? { sessionId } : undefined,
      include: {
        session: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return classes;
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    throw new Error('Failed to fetch classes');
  }
}

export async function getBatches(classId?: string) {
  try {
    const batches = await prisma.batch.findMany({
      where: classId ? { classId } : undefined,
      include: {
        class: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return batches;
  } catch (error) {
    console.error('Failed to fetch batches:', error);
    throw new Error('Failed to fetch batches');
  }
}

export async function getSections(classId?: string) {
  try {
    const sections = await prisma.section.findMany({
      where: classId ? { classId } : undefined,
      include: {
        class: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return sections;
  } catch (error) {
    console.error('Failed to fetch sections:', error);
    throw new Error('Failed to fetch sections');
  }
}