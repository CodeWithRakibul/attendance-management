import { prisma } from '@/lib/prisma'
import type { StudentWithRelations, TeacherWithRelations } from '@/types'

// STUDENT REPORTS
export async function getStudentInfoReports(sessionId: string) {
  const [genderRatio, guardianList, admissionTrends, classWiseCount] = await Promise.all([
    // Gender ratio
    prisma.$queryRaw`
      SELECT 
        JSON_EXTRACT(personal, '$.gender') as gender,
        COUNT(*) as count
      FROM Student 
      WHERE sessionId = ${sessionId} AND status = 'ACTIVE'
      GROUP BY JSON_EXTRACT(personal, '$.gender')
    `,
    
    // Guardian contact list
    prisma.student.findMany({
      where: { sessionId, status: 'ACTIVE' },
      select: {
        studentId: true,
        personal: true,
        guardian: true,
        class: { select: { name: true } },
        batch: { select: { name: true } }
      },
      orderBy: { studentId: 'asc' }
    }),

    // Admission trends by month
    prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COUNT(*) as count
      FROM Student 
      WHERE sessionId = ${sessionId}
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month ASC
    `,

    // Class-wise student count
    prisma.student.groupBy({
      by: ['classId'],
      where: { sessionId, status: 'ACTIVE' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })
  ])

  return { genderRatio, guardianList, admissionTrends, classWiseCount }
}

// FINANCE REPORTS
export async function getFinanceReports(sessionId: string, filters?: {
  startDate?: Date
  endDate?: Date
}) {
  const where: any = { sessionId }
  if (filters?.startDate && filters?.endDate) {
    where.createdAt = {
      gte: filters.startDate,
      lte: filters.endDate
    }
  }

  const [dailyCollection, pendingDues, monthlyCollection, paymentMethods] = await Promise.all([
    // Daily collection summary
    prisma.collection.groupBy({
      by: ['collectedAt'],
      where: { ...where, status: 'APPROVED' },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { collectedAt: 'desc' }
    }),

    // Pending dues
    prisma.collection.findMany({
      where: { sessionId, status: 'PENDING' },
      include: {
        student: {
          select: {
            studentId: true,
            personal: true,
            guardian: true
          }
        },
        feeMaster: { select: { name: true, dueDate: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),

    // Monthly collection trends
    prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(collectedAt, '%Y-%m') as month,
        SUM(amount) as total,
        COUNT(*) as count
      FROM Collection 
      WHERE sessionId = ${sessionId} AND status = 'APPROVED'
      GROUP BY DATE_FORMAT(collectedAt, '%Y-%m')
      ORDER BY month ASC
    `,

    // Payment method breakdown
    prisma.collection.groupBy({
      by: ['method'],
      where: { sessionId, status: 'APPROVED' },
      _sum: { amount: true },
      _count: { id: true }
    })
  ])

  return { dailyCollection, pendingDues, monthlyCollection, paymentMethods }
}

// ATTENDANCE REPORTS
export async function getAttendanceReports(sessionId: string, filters?: {
  startDate?: Date
  endDate?: Date
  classId?: string
  batchId?: string
}) {
  const where: any = { sessionId }
  if (filters?.startDate && filters?.endDate) {
    where.date = {
      gte: filters.startDate,
      lte: filters.endDate
    }
  }
  if (filters?.classId) {
    where.student = { classId: filters.classId }
  }
  if (filters?.batchId) where.batchId = filters.batchId

  const [dailySummary, monthlyTrends, studentWiseAttendance, staffAttendance] = await Promise.all([
    // Daily attendance summary
    prisma.attendanceStudent.groupBy({
      by: ['date', 'status'],
      where,
      _count: { id: true },
      orderBy: { date: 'desc' }
    }),

    // Monthly attendance trends
    prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(date, '%Y-%m') as month,
        status,
        COUNT(*) as count
      FROM AttendanceStudent 
      WHERE sessionId = ${sessionId}
      ${filters?.startDate ? `AND date >= '${filters.startDate.toISOString()}'` : ''}
      ${filters?.endDate ? `AND date <= '${filters.endDate.toISOString()}'` : ''}
      GROUP BY DATE_FORMAT(date, '%Y-%m'), status
      ORDER BY month ASC
    `,

    // Student-wise attendance percentage
    prisma.$queryRaw`
      SELECT 
        s.studentId,
        s.personal,
        COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) as present_days,
        COUNT(a.id) as total_days,
        ROUND((COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) / COUNT(a.id)) * 100, 2) as attendance_percentage
      FROM Student s
      LEFT JOIN AttendanceStudent a ON s.id = a.studentId
      WHERE s.sessionId = ${sessionId} AND s.status = 'ACTIVE'
      ${filters?.startDate ? `AND a.date >= '${filters.startDate.toISOString()}'` : ''}
      ${filters?.endDate ? `AND a.date <= '${filters.endDate.toISOString()}'` : ''}
      GROUP BY s.id, s.studentId, s.personal
      ORDER BY attendance_percentage DESC
    `,

    // Staff attendance summary
    prisma.attendanceStaff.groupBy({
      by: ['staffId', 'status'],
      where: filters?.startDate && filters?.endDate ? {
        date: {
          gte: filters.startDate,
          lte: filters.endDate
        }
      } : {},
      _count: { id: true }
    })
  ])

  return { dailySummary, monthlyTrends, studentWiseAttendance, staffAttendance }
}

// COMPREHENSIVE MONTHLY REPORT CARDS
export async function getMonthlyReportCards(sessionId: string, month: number, year: number) {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  return prisma.student.findMany({
    where: { sessionId, status: 'ACTIVE' },
    include: {
      class: { select: { name: true } },
      batch: { select: { name: true } },
      section: { select: { name: true } },
      
      // Attendance for the month
      attendanceStudent: {
        where: {
          date: { gte: startDate, lte: endDate }
        },
        select: { date: true, status: true }
      },
      
      // Fee collections for the month
      collections: {
        where: {
          collectedAt: { gte: startDate, lte: endDate },
          status: 'APPROVED'
        },
        include: {
          feeMaster: { select: { name: true, amount: true } }
        }
      },
      
      // Notes added during the month
      notes: {
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        include: {
          staff: { select: { personal: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: [
      { class: { name: 'asc' } },
      { batch: { name: 'asc' } },
      { roll: 'asc' }
    ]
  })
}

// USER ACTIVITY LOGS (if implemented)
export async function getUserLogs(filters?: {
  userId?: string
  action?: string
  startDate?: Date
  endDate?: Date
}) {
  // This would require a separate UserLog model
  // Placeholder for future implementation
  return []
}

// EXPORT DATA HELPERS
export async function getExportData(type: 'students' | 'teachers' | 'attendance' | 'fees', sessionId: string, filters?: any) {
  switch (type) {
    case 'students':
      return prisma.student.findMany({
        where: { sessionId, ...filters },
        include: {
          class: true,
          batch: true,
          section: true
        }
      })
    
    case 'teachers':
      return prisma.teacher.findMany({
        where: { sessionId, ...filters }
      })
    
    case 'attendance':
      return prisma.attendanceStudent.findMany({
        where: { sessionId, ...filters },
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
      })
    
    case 'fees':
      return prisma.collection.findMany({
        where: { sessionId, ...filters },
        include: {
          student: {
            select: {
              studentId: true,
              personal: true
            }
          },
          feeMaster: true
        }
      })
    
    default:
      return []
  }
}