'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

export async function getStudentsForAttendance(params: {
  sessionId: string;
  classId: string;
  batchId: string;
  date: string;
}) {
  try {
    const students = await prisma.student.findMany({
      where: {
        sessionId: params.sessionId,
        classId: params.classId,
        batchId: params.batchId,
        status: 'ACTIVE',
      },
      // TODO: Add attendance relation when schema is ready
      orderBy: {
        roll: 'asc',
      },
    });

    // Add attendance status to each student
    return students.map(student => ({
      ...student,
      attendanceStatus: null, // TODO: Fix when attendance schema is ready
    }));
  } catch (error) {
    console.error('Failed to fetch students for attendance:', error);
    throw new Error('Failed to fetch students for attendance');
  }
}

export async function markStudentAttendance(attendanceData: Array<{
  studentId: string;
  batchId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}>) {
  try {
    // Use transaction to ensure all records are created/updated together
    await prisma.$transaction(async (tx) => {
      for (const record of attendanceData) {
        // TODO: Implement when attendance schema is ready
        console.log('Would mark attendance for student:', record);
      }
    });

    revalidatePath('/dashboard/attendance');
    return { success: true };
  } catch (error) {
    console.error('Failed to mark student attendance:', error);
    return { success: false, error: 'Failed to mark student attendance' };
  }
}

export async function getStaffForAttendance(date: string) {
  try {
    const staff = await prisma.teacher.findMany({
      where: {
        status: 'ACTIVE',
      },
      // TODO: Add attendance relation when schema is ready
      orderBy: {
        staffId: 'asc',
      },
    });

    // Add attendance status to each staff member
    return staff.map(member => ({
      ...member,
      attendanceStatus: null,
      checkInTime: null,
      checkOutTime: null,
    }));
  } catch (error) {
    console.error('Failed to fetch staff for attendance:', error);
    throw new Error('Failed to fetch staff for attendance');
  }
}

export async function markStaffAttendance(attendanceData: Array<{
  staffId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
  checkInTime?: string | null;
  checkOutTime?: string | null;
}>) {
  try {
    // Use transaction to ensure all records are created/updated together
    await prisma.$transaction(async (tx) => {
      for (const record of attendanceData) {
        // TODO: Implement when attendance schema is ready
        console.log('Would mark attendance for staff:', record);
      }
    });

    revalidatePath('/dashboard/attendance');
    return { success: true };
  } catch (error) {
    console.error('Failed to mark staff attendance:', error);
    return { success: false, error: 'Failed to mark staff attendance' };
  }
}

export async function getAttendanceHistory(
  type: 'student' | 'staff',
  filters: {
    dateFrom?: string;
    dateTo?: string;
    batchId?: string;
    status?: string;
  }
) {
  try {
    if (type === 'student') {
      // TODO: Implement when attendance schema is ready
      const records: any[] = [];

      return records;
    } else {
      // TODO: Implement when attendance schema is ready
      const records: any[] = [];

      return records;
    }
  } catch (error) {
    console.error('Failed to fetch attendance history:', error);
    throw new Error('Failed to fetch attendance history');
  }
}

export async function exportAttendanceReport(
  type: 'student' | 'staff',
  format: 'csv' | 'excel',
  filters: {
    dateFrom?: string;
    dateTo?: string;
    batchId?: string;
    status?: string;
  }
) {
  try {
    // This is a placeholder for the export functionality
    // In a real implementation, you would generate and download the file
    const data = await getAttendanceHistory(type, filters);
    
    // TODO: Implement actual file generation and download
    console.log(`Exporting ${type} attendance as ${format}:`, data.length, 'records');
    
    return { success: true, message: `${type} attendance exported successfully` };
  } catch (error) {
    console.error('Failed to export attendance report:', error);
    throw new Error('Failed to export attendance report');
  }
}