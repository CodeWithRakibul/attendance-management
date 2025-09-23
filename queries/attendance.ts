import { prisma } from '@/lib/prisma'
import type {
  AttendanceFormData,
  AttendanceStudentWithRelations,
  AttendanceFilters
} from '@/types'
import { AttendanceStatus } from '@prisma/client'

// STUDENT ATTENDANCE
export async function markStudentAttendance(data: Omit<AttendanceFormData, 'date'> & { date: Date }) {
  return prisma.attendanceStudent.upsert({
    where: {
      studentId_date: {
        studentId: data.studentId,
        date: data.date
      }
    },
    update: { status: data.status, markedBy: data.markedBy },
    create: data
  })
}

export async function markBatchAttendance(attendanceData: Array<Omit<AttendanceFormData, 'date'> & { date: Date }>) {
  return prisma.$transaction(
    attendanceData.map(data => 
      prisma.attendanceStudent.upsert({
        where: {
          studentId_date: {
            studentId: data.studentId,
            date: data.date
          }
        },
        update: { status: data.status, markedBy: data.markedBy },
        create: data
      })
    )
  )
}

export async function getStudentAttendance(filters: AttendanceFilters & {
  sessionId: string
  studentId?: string
  startDate?: Date
  endDate?: Date
}) {
  const where: any = { sessionId: filters.sessionId }
  
  if (filters.batchId) where.batchId = filters.batchId
  if (filters.studentId) where.studentId = filters.studentId
  if (filters.date) {
    const dateObj = new Date(filters.date)
    where.date = {
      gte: new Date(dateObj.setHours(0, 0, 0, 0)),
      lt: new Date(dateObj.setHours(23, 59, 59, 999))
    }
  }
  if (filters.startDate && filters.endDate) {
    where.date = {
      gte: filters.startDate,
      lte: filters.endDate
    }
  }

  return prisma.attendanceStudent.findMany({
    where,
    include: {
      student: {
        select: {
          studentId: true,
          personal: true,
          roll: true
        }
      },
      batch: { select: { name: true } }
    },
    orderBy: [{ date: 'desc' }, { student: { roll: 'asc' } }]
  })
}

// STAFF ATTENDANCE
export async function markStaffAttendance(data: {
  staffId: string
  date: Date
  status: AttendanceStatus
  checkIn?: Date
  checkOut?: Date
}) {
  return prisma.attendanceStaff.upsert({
    where: {
      staffId_date: {
        staffId: data.staffId,
        date: data.date
      }
    },
    update: { 
      status: data.status, 
      checkIn: data.checkIn,
      checkOut: data.checkOut 
    },
    create: data
  })
}

export async function getStaffAttendance(filters?: {
  staffId?: string
  date?: Date
  startDate?: Date
  endDate?: Date
}) {
  const where: any = {}
  
  if (filters?.staffId) where.staffId = filters.staffId
  if (filters?.date) {
    where.date = {
      gte: new Date(filters.date.setHours(0, 0, 0, 0)),
      lt: new Date(filters.date.setHours(23, 59, 59, 999))
    }
  }
  if (filters?.startDate && filters?.endDate) {
    where.date = {
      gte: filters.startDate,
      lte: filters.endDate
    }
  }

  return prisma.attendanceStaff.findMany({
    where,
    include: {
      staff: {
        select: {
          staffId: true,
          personal: true,
          designation: true
        }
      }
    },
    orderBy: { date: 'desc' }
  })
}

// ATTENDANCE REPORTS
export async function getDailyAttendanceSummary(sessionId: string, date: Date) {
  const [studentStats, staffStats] = await Promise.all([
    prisma.attendanceStudent.groupBy({
      by: ['status'],
      where: {
        sessionId,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        }
      },
      _count: { id: true }
    }),
    prisma.attendanceStaff.groupBy({
      by: ['status'],
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        }
      },
      _count: { id: true }
    })
  ])

  return { studentStats, staffStats }
}

export async function getMonthlyAttendanceReport(sessionId: string, month: number, year: number) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const [studentAttendance, staffAttendance] = await Promise.all([
    prisma.attendanceStudent.findMany({
      where: {
        sessionId,
        date: { gte: startDate, lte: endDate }
      },
      include: {
        student: {
          select: {
            studentId: true,
            personal: true,
            class: { select: { name: true } },
            batch: { select: { name: true } }
          }
        }
      }
    }),
    prisma.attendanceStaff.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      },
      include: {
        staff: {
          select: {
            staffId: true,
            personal: true,
            designation: true
          }
        }
      }
    })
  ])

  return { studentAttendance, staffAttendance }
}

// DELETE ATTENDANCE
export async function deleteStudentAttendance(studentId: string, date: Date) {
  return prisma.attendanceStudent.delete({
    where: {
      studentId_date: { studentId, date }
    }
  })
}

export async function deleteStaffAttendance(staffId: string, date: Date) {
  return prisma.attendanceStaff.delete({
    where: {
      staffId_date: { staffId, date }
    }
  })
}