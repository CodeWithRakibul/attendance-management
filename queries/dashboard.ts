import { prisma } from '@/lib/prisma'
import type { Session } from '@/types'

export async function getDashboardStats(sessionId: string) {
  const [totalStudents, activeTeachers, pendingFees, todayAttendance] = await Promise.all([
    prisma.student.count({ where: { sessionId, status: 'ACTIVE' } }),
    prisma.teacher.count({ where: { sessionId, status: 'ACTIVE' } }),
    prisma.collection.count({ where: { sessionId, status: 'PENDING' } }),
    prisma.attendanceStudent.count({ 
      where: { 
        sessionId, 
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: 'PRESENT'
      } 
    })
  ])

  return { totalStudents, activeTeachers, pendingFees, todayAttendance }
}

export async function getAdmissionTrends(sessionId: string) {
  return prisma.student.groupBy({
    by: ['createdAt'],
    where: { sessionId },
    _count: { id: true },
    orderBy: { createdAt: 'asc' }
  })
}

export async function getCollectionVsExpense(sessionId: string) {
  const collections = await prisma.collection.aggregate({
    where: { sessionId, status: 'APPROVED' },
    _sum: { amount: true }
  })
  
  return { totalCollection: collections._sum.amount || 0 }
}

export async function getAttendancePercentage(sessionId: string) {
  const total = await prisma.attendanceStudent.count({ where: { sessionId } })
  const present = await prisma.attendanceStudent.count({ 
    where: { sessionId, status: 'PRESENT' } 
  })
  
  return total > 0 ? (present / total) * 100 : 0
}