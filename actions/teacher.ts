'use server'

import { revalidatePath } from 'next/cache'
import { 
  createTeacher, 
  updateTeacher, 
  deleteTeacher, 
  createLeaveRequest, 
  updateLeaveStatus, 
  deleteLeaveRequest 
} from '@/queries/teacher'
import type { TeacherFormData } from '@/types'
import { LeaveType, LeaveStatus } from '@prisma/client'

export async function createTeacherAction(data: TeacherFormData) {
  try {
    await createTeacher(data)
    revalidatePath('/dashboard/teachers')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create teacher' }
  }
}

export async function updateTeacherAction(id: string, data: Partial<TeacherFormData>) {
  try {
    await updateTeacher(id, data)
    revalidatePath('/dashboard/teachers')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update teacher' }
  }
}

export async function deleteTeacherAction(id: string) {
  try {
    await deleteTeacher(id)
    revalidatePath('/dashboard/teachers')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete teacher' }
  }
}

export async function createLeaveRequestAction(data: {
  teacherId: string
  leaveType: LeaveType
  startDate: Date
  endDate: Date
  reason: string
}) {
  try {
    await createLeaveRequest(data)
    revalidatePath('/dashboard/teachers')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create leave request' }
  }
}

export async function updateLeaveStatusAction(id: string, data: {
  status: LeaveStatus
  approvedBy?: string
}) {
  try {
    await updateLeaveStatus(id, {
      ...data,
      approvedAt: data.status === 'APPROVED' ? new Date() : undefined
    })
    revalidatePath('/dashboard/teachers')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update leave status' }
  }
}

export async function deleteLeaveRequestAction(id: string) {
  try {
    await deleteLeaveRequest(id)
    revalidatePath('/dashboard/teachers')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete leave request' }
  }
}