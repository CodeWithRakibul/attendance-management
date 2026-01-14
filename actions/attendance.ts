'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { 
  markStudentAttendance, 
  markBatchAttendance, 
  markStaffAttendance, 
  deleteStudentAttendance, 
  deleteStaffAttendance 
} from '@/queries/attendance'
import type { AttendanceFormData } from '@/types'
import { AttendanceStatus } from '@prisma/client'
import { getStudentAttendance, getStaffAttendance } from '@/queries/attendance'
import { getCurrentSession } from '@/queries/session'

// Fetch students with their attendance status for a specific date
export async function getStudentsForAttendanceAction(params: {
  sessionId: string;
  classId: string;
  batchId: string;
  date: string; // ISO string YYYY-MM-DD
}) {
  try {
    const { sessionId, classId, batchId, date } = params

    // 1. Fetch Students
    const students = await prisma.student.findMany({
      where: {
        sessionId,
        classId,
        batchId,
        status: 'ACTIVE'
      },
      orderBy: { roll: 'asc' }, // Assuming 'roll' is sortable string/number
      select: {
        id: true,
        studentId: true,
        roll: true,
        personal: true,
      }
    })

    // 2. Fetch Attendance for this date
    // Create date range for the day
    const queryDate = new Date(date)
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999))

    const attendanceRecords = await prisma.attendanceStudent.findMany({
      where: {
        studentId: { in: students.map(s => s.id) },
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // 3. Merge
    const studentsWithStatus = students.map(student => {
      const record = attendanceRecords.find(r => r.studentId === student.id)
      return {
        ...student,
        attendanceStatus: record ? record.status : null
      }
    })

    return studentsWithStatus

  } catch (error) {
    console.error('Failed to get students for attendance', error)
    throw new Error('Failed to fetch students')
  }
}


// Fetch staff with their attendance status for a specific date
export async function getStaffForAttendanceAction(date: string) {
  try {
    // 1. Fetch Active Staff (Teachers)
    const staff = await prisma.teacher.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: { staffId: 'asc' },
      select: {
        id: true,
        staffId: true,
        designation: true,
        personal: true,
      }
    })

    // 2. Fetch Attendance for this date
    const queryDate = new Date(date)
    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999))

    const attendanceRecords = await prisma.attendanceStaff.findMany({
      where: {
        staffId: { in: staff.map(s => s.id) },
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })

    // 3. Merge
    const staffWithStatus = staff.map(member => {
      const record = attendanceRecords.find(r => r.staffId === member.id)
      return {
        ...member,
        attendanceStatus: record ? record.status : null,
        checkInTime: record?.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : null,
        checkOutTime: record?.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : null,
      }
    })

    return staffWithStatus

  } catch (error) {
    console.error('Failed to get staff for attendance', error)
    throw new Error('Failed to fetch staff')
  }
}



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

export async function markBatchStaffAttendanceAction(attendanceData: Array<{
  staffId: string
  date: Date
  status: AttendanceStatus
  checkIn?: Date
  checkOut?: Date
}>) {
  try {
    await prisma.$transaction(
      attendanceData.map(data => 
          prisma.attendanceStaff.upsert({
              where: { staffId_date: { staffId: data.staffId, date: data.date } },
              update: { status: data.status, checkIn: data.checkIn, checkOut: data.checkOut },
              create: data
          })
      )
   )
    revalidatePath('/dashboard/attendance')
    return { success: true }
  } catch (error) {
    console.error('Failed to mark batch staff attendance', error)
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

export async function getAttendanceHistoryAction(type: 'student' | 'staff', filters: {
  dateFrom?: string;
  dateTo?: string;
  batchId?: string;
  status?: string;
}) {
  try {
    const activeSession = await getCurrentSession();
    if (!activeSession) return [];

    const startDate = filters.dateFrom ? new Date(filters.dateFrom) : undefined;
    const endDate = filters.dateTo ? new Date(filters.dateTo) : undefined;

    if (type === 'student') {
        const studentFilters: any = {
            sessionId: activeSession.id,
            startDate,
            endDate
        };
        if (filters.batchId) studentFilters.batchId = filters.batchId;
        // Logic to filter by status is done in query or post-filtering
        // The current query supports filtering by exact date using 'date' param, 
        // but for range it uses startDate/endDate.
        // Prisma query 'where' construction needs to be checked.
        
        // Actually, let's look at getStudentAttendance implementation. 
        // It accepts startDate/endDate.
        
        const data = await getStudentAttendance(studentFilters);
        
        // Post-filter by status if provided (since query might not support it directly or we want to keep it simple)
        if (filters.status && filters.status !== 'ALL') {
            return data.filter(r => r.status === filters.status);
        }
        return data;
    } else {
        const staffFilters: any = {
            startDate,
            endDate
        };

        const data = await getStaffAttendance(staffFilters);

         if (filters.status && filters.status !== 'ALL') {
             return data.filter(r => r.status === filters.status);
         }
         return data;
    }
  } catch (error) {
    console.error('Failed to get attendance history', error);
    return [];
  }
}

export async function exportAttendanceReportAction(
  type: 'student' | 'staff', 
  format: 'csv' | 'excel', 
  filters: any
) {
  // Placeholder for export logic. 
  // In a real app, this might generate a file and return a URL or stream.
  // For now, we simulate success.
  return { success: true, message: 'Export logic not implemented yet' };
}