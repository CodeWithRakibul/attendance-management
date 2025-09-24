'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTeacherAction(data: any) {
  try {
    const session = await prisma.session.findFirst({
      where: { status: 'ACTIVE' }
    });
    
    if (!session) {
      return { success: false, error: 'No active session found' };
    }

    // Check if staffId already exists and generate unique one if needed
    let staffId = data.teacherId;
    const existingTeacher = await prisma.teacher.findUnique({
      where: { staffId }
    });
    
    if (existingTeacher) {
      // Generate unique staffId by appending timestamp
      staffId = `${data.teacherId}-${Date.now()}`;
    }

    const teacher = await prisma.teacher.create({
      data: {
        staffId,
        sessionId: session.id,
        personal: {
          nameEn: data.nameEn,
          nameBn: data.nameBn || '',
          dob: data.dob || '',
          gender: data.gender || 'MALE',
          bloodGroup: data.bloodGroup || '',
        },
        contact: {
          mobile: data.mobile,
          email: data.email || '',
        },
        address: {
          present: data.presentAddress || '',
          permanent: data.permanentAddress || '',
        },
        designation: data.designation,
        subjects: data.subjects,
        qualification: data.qualification || '',
        experience: data.experience || '',
        salaryInfo: {
          basicSalary: data.basicSalary || 0,
          allowances: data.allowances || 0,
          advanceTaken: 0,
        },
        status: data.status || 'ACTIVE',
      },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true, data: teacher };
  } catch (error) {
    console.error('Failed to create teacher:', error);
    return { success: false, error: 'Failed to create teacher' };
  }
}

export async function createLeaveRequestAction(data: any) {
  try {
    const leave = await prisma.teacherLeave.create({
      data: {
        teacherId: data.teacherId,
        leaveType: data.leaveType,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        status: 'PENDING',
      },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true, data: leave };
  } catch (error) {
    console.error('Failed to create leave request:', error);
    return { success: false, error: 'Failed to create leave request' };
  }
}

export async function updateLeaveStatusAction(id: string, status: string) {
  try {
    const leave = await prisma.teacherLeave.update({
      where: { id },
      data: { status: status as any },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true, data: leave };
  } catch (error) {
    console.error('Failed to update leave status:', error);
    return { success: false, error: 'Failed to update leave status' };
  }
}

export async function deleteLeaveRequestAction(id: string) {
  try {
    await prisma.teacherLeave.delete({
      where: { id },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete leave request:', error);
    return { success: false, error: 'Failed to delete leave request' };
  }
}

export async function updateTeacherAction(id: string, data: any) {
  try {
    // Get current teacher data to preserve existing JSON fields
    const currentTeacher = await prisma.teacher.findUnique({
      where: { id }
    });
    
    if (!currentTeacher) {
      return { success: false, error: 'Teacher not found' };
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        staffId: data.teacherId,
        personal: {
          nameEn: data.nameEn,
          nameBn: data.nameBn || '',
          dob: data.dob || '',
          gender: data.gender || 'MALE',
          bloodGroup: data.bloodGroup || '',
        },
        contact: {
          mobile: data.mobile,
          email: data.email || '',
        },
        address: {
          present: data.presentAddress || '',
          permanent: data.permanentAddress || '',
        },
        designation: data.designation,
        subjects: data.subjects,
        qualification: data.qualification || '',
        experience: data.experience || '',
        salaryInfo: {
          basicSalary: data.basicSalary || 0,
          allowances: data.allowances || 0,
          advanceTaken: (currentTeacher.salaryInfo as any)?.advanceTaken || 0,
        },
        status: data.status,
      },
    });

    revalidatePath('/dashboard/teachers');
    revalidatePath(`/dashboard/teachers/${id}`);
    return { success: true, data: teacher };
  } catch (error) {
    console.error('Failed to update teacher:', error);
    return { success: false, error: 'Failed to update teacher' };
  }
}

export async function deleteTeacherAction(id: string) {
  try {
    await prisma.teacher.update({
      where: { id },
      data: { status: 'DISABLED' },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete teacher:', error);
    return { success: false, error: 'Failed to delete teacher' };
  }
}