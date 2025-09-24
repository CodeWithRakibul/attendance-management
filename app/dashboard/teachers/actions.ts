'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { TeacherFormData, TeacherStatus, LeaveType, LeaveStatus } from '@/types/teacher';

// Custom form data for teacher creation (different structure than global type)
export type TeacherCreateFormData = {
  teacherId: string;
  personal: {
    nameEn: string;
    nameBn?: string;
    dob: string;
    gender: string;
    bloodGroup?: string;
    photoUrl?: string;
  };
  contact: {
    smsNo: string;
    altNo?: string;
    email?: string;
    address: {
      present: string;
      permanent: string;
    };
  };
  designation: string;
  subjects: string[];
  qualification: string;
  experience?: string;
  salaryInfo: {
    basic: number;
    allowances?: number;
    paymentMethod?: string;
  };
  joiningDate: string;
  status?: TeacherStatus;
};

export async function createTeacher(data: TeacherCreateFormData) {
  try {
    // Get the active session
    const session = await prisma.session.findFirst({
      where: { status: 'ACTIVE' }
    });
    
    if (!session) {
      return { success: false, error: 'No active session found' };
    }

    const teacher = await prisma.teacher.create({
      data: {
        staffId: data.teacherId,
        sessionId: session.id,
        personal: data.personal,
        contact: {
          mobile: data.contact.smsNo,
          email: data.contact.email,
        },
        address: data.contact.address,
        designation: data.designation,
        subjects: data.subjects,
        qualification: data.qualification,
        experience: data.experience,
        salaryInfo: data.salaryInfo,
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

export async function updateTeacher(id: string, data: Partial<TeacherCreateFormData>) {
  try {
    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        ...(data.teacherId && { staffId: data.teacherId }),
        ...(data.personal && { personal: data.personal }),
        ...(data.contact && { 
          contact: {
            smsNo: data.contact.smsNo,
            altNo: data.contact.altNo,
            email: data.contact.email,
          },
          address: data.contact.address,
        }),
        ...(data.designation && { designation: data.designation }),
        ...(data.subjects && { subjects: data.subjects }),
        ...(data.qualification && { qualification: data.qualification }),
        ...(data.experience && { experience: data.experience }),
        ...(data.salaryInfo && { salaryInfo: data.salaryInfo }),
        ...(data.status && { status: data.status }),
      },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true, data: teacher };
  } catch (error) {
    console.error('Failed to update teacher:', error);
    return { success: false, error: 'Failed to update teacher' };
  }
}

export async function deleteTeacher(id: string) {
  try {
    await prisma.teacher.update({
      where: { id },
      data: { status: 'DISABLED' },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true };
  } catch (error) {
    console.error('Failed to disable teacher:', error);
    return { success: false, error: 'Failed to disable teacher' };
  }
}

export async function createTeacherLeave(data: {
  teacherId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status?: LeaveStatus;
}) {
  try {
    const leave = await prisma.teacherLeave.create({
      data: {
        teacherId: data.teacherId,
        leaveType: data.leaveType,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        status: data.status || 'PENDING',
      },
      include: {
        teacher: true,
      },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true, data: leave };
  } catch (error) {
    console.error('Failed to create teacher leave:', error);
    return { success: false, error: 'Failed to create teacher leave' };
  }
}

export async function updateTeacherLeave(id: string, status: LeaveStatus, approvedBy?: string) {
  try {
    const leave = await prisma.teacherLeave.update({
      where: { id },
      data: {
        status,
        approvedBy,
        approvedAt: status === 'APPROVED' ? new Date() : null,
      },
      include: {
        teacher: true,
      },
    });

    revalidatePath('/dashboard/teachers');
    return { success: true, data: leave };
  } catch (error) {
    console.error('Failed to update teacher leave:', error);
    return { success: false, error: 'Failed to update teacher leave' };
  }
}

export async function getTeacherLeaves(teacherId?: string) {
  try {
    const leaves = await prisma.teacherLeave.findMany({
      where: teacherId ? { teacherId } : undefined,
      include: {
        teacher: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return leaves;
  } catch (error) {
    console.error('Failed to fetch teacher leaves:', error);
    throw new Error('Failed to fetch teacher leaves');
  }
}