import { prisma } from '@/lib/prisma'
import type {
  TeacherFormData,
  TeacherWithRelations,
  TeacherFilters,
  TeacherLeaveFormData
} from '@/types'
import { TeacherStatus, LeaveType, LeaveStatus, Prisma } from '@prisma/client'

// CREATE
export async function createTeacher(data: TeacherFormData) {
  return prisma.teacher.create({
    data: {
      ...data,
      personal: data.personal as unknown as Prisma.JsonObject,
      contact: data.contact as unknown as Prisma.JsonObject,
      address: data.address as unknown as Prisma.JsonObject,
      salaryInfo: data.salaryInfo as unknown as Prisma.JsonObject,
      subjects: data.subjects as unknown as Prisma.JsonArray
    }
  })
}

export async function getTeachers() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        leaves: {
          where: {
            status: 'APPROVED',
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        attendanceStaff: {
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

    return teachers;
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    throw new Error('Failed to fetch teachers');
  }
}

export async function getTeacher(id: string) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        leaves: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        attendanceStaff: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return teacher;
  } catch (error) {
    console.error('Failed to fetch teacher:', error);
    throw new Error('Failed to fetch teacher');
  }
}

// UPDATE
export async function updateTeacher(id: string, data: Partial<TeacherFormData>) {
  const updateData: any = { ...data }
  if (data.personal) updateData.personal = data.personal as unknown as Prisma.JsonObject
  if (data.contact) updateData.contact = data.contact as unknown as Prisma.JsonObject
  if (data.address) updateData.address = data.address as unknown as Prisma.JsonObject
  if (data.salaryInfo) updateData.salaryInfo = data.salaryInfo as unknown as Prisma.JsonObject
  if (data.subjects) updateData.subjects = data.subjects as unknown as Prisma.JsonArray

  return prisma.teacher.update({
    where: { id },
    data: updateData
  })
}

// DELETE
export async function deleteTeacher(id: string) {
  return prisma.teacher.delete({ where: { id } })
}

// LEAVE MANAGEMENT
export async function createLeaveRequest(data: {
  teacherId: string
  leaveType: LeaveType
  startDate: Date
  endDate: Date
  reason: string
}) {
  return prisma.teacherLeave.create({ data })
}

export async function updateLeaveStatus(id: string, data: {
  status: LeaveStatus
  approvedBy?: string
  approvedAt?: Date
}) {
  return prisma.teacherLeave.update({
    where: { id },
    data: {
      ...data,
      approvedAt: data.status === 'APPROVED' ? new Date() : undefined
    }
  })
}

export async function getLeaveRequests(filters?: {
  teacherId?: string
  status?: LeaveStatus
  startDate?: Date
  endDate?: Date
}) {
  const where: any = {}

  if (filters?.teacherId) where.teacherId = filters.teacherId
  if (filters?.status) where.status = filters.status
  if (filters?.startDate && filters?.endDate) {
    where.startDate = { gte: filters.startDate }
    where.endDate = { lte: filters.endDate }
  }

  return prisma.teacherLeave.findMany({
    where,
    include: { teacher: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function deleteLeaveRequest(id: string) {
  return prisma.teacherLeave.delete({ where: { id } })
}

// DASHBOARD DATA
export async function getTeacherDashboard(teacherId: string) {
  const [attendanceSummary, recentLeaves, totalStudents] = await Promise.all([
    prisma.attendanceStaff.count({
      where: {
        staffId: teacherId,
        date: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
        status: 'PRESENT'
      }
    }),
    prisma.teacherLeave.findMany({
      where: { teacherId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.student.count({ where: { status: 'ACTIVE' } })
  ])

  return { attendanceSummary, recentLeaves, totalStudents }
}

// TEACHER STATS
export async function getTeacherStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalTeachers, activeTeachers, onLeaveToday, teachersWithExperience] = await Promise.all([
    prisma.teacher.count(),
    prisma.teacher.count({ where: { status: 'ACTIVE' } }),
    prisma.teacherLeave.count({
      where: {
        status: 'APPROVED',
        startDate: { lte: today },
        endDate: { gte: today }
      }
    }),
    prisma.teacher.findMany({
      where: { experience: { not: null } },
      select: { experience: true }
    })
  ])

  const avgExperience = teachersWithExperience.length > 0 
    ? teachersWithExperience.reduce((sum, t) => sum + (parseInt(t.experience || '0') || 0), 0) / teachersWithExperience.length
    : 0

  return {
    totalTeachers,
    activeTeachers,
    onLeaveToday,
    avgExperience: Math.round(avgExperience * 10) / 10
  }
}