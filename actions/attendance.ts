'use server'

import { revalidatePath } from 'next/cache'
import { 
  markStudentAttendance, 
  markBatchAttendance, 
  markStaffAttendance, 
  deleteStudentAttendance, 
  deleteStaffAttendance 
} from '@/queries/attendance'
import type { AttendanceFormData } from '@/types'
import { AttendanceStatus } from '@prisma/client'

export async function markStudentAttendanceAction(data: Omit<AttendanceFormData, 'date'> & { date: Date }) {
  try {
    await markStudentAttendance(data)
    revalidatePath('/dashboard/attendance')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to mark attendance' }
  }
}

export async function markBatchAttendanceAction(attendanceData: Array<Omit<AttendanceFormData, 'date'> & { date: Date }>) {
  try {
    await markBatchAttendance(attendanceData)
    revalidatePath('/dashboard/attendance')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to mark batch attendance' }
  }
}

export async function markStaffAttendanceAction(data: {
  staffId: string
  date: Date
  status: AttendanceStatus
  checkIn?: Date
  checkOut?: Date
}) {
  try {
    await markStaffAttendance(data)
    revalidatePath('/dashboard/attendance')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to mark staff attendance' }
  }
}

export async function deleteStudentAttendanceAction(studentId: string, date: Date) {
  try {
    await deleteStudentAttendance(studentId, date)
    revalidatePath('/dashboard/attendance')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete attendance' }
  }
}

export async function deleteStaffAttendanceAction(staffId: string, date: Date) {
  try {
    await deleteStaffAttendance(staffId, date)
    revalidatePath('/dashboard/attendance')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete staff attendance' }
  }
}