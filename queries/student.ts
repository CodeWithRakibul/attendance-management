import { prisma } from '@/lib/prisma'
import type {
  StudentFormData,
  StudentFilters,
} from '@/types'
import { Prisma } from '@prisma/client'

// CREATE
export async function createStudent(data: StudentFormData) {
  return prisma.student.create({
    data: {
      ...data,
      personal: data.personal as unknown as Prisma.JsonObject,
      guardian: data.guardian as unknown as Prisma.JsonObject,
      address: data.address as unknown as Prisma.JsonObject
    }
  })
}

// READ
export async function getStudents(sessionId: string, filters?: StudentFilters) {
  const where: any = { sessionId }

  if (filters?.classId) where.classId = filters.classId
  if (filters?.batchId) where.batchId = filters.batchId
  if (filters?.sectionId) where.sectionId = filters.sectionId
  if (filters?.status) where.status = filters.status
  if (filters?.search) {
    where.OR = [
      { studentId: { contains: filters.search, mode: 'insensitive' } },
      { personal: { path: ['nameEn'], string_contains: filters.search } },
      { personal: { path: ['nameBn'], string_contains: filters.search } }
    ]
  }

  return prisma.student.findMany({
    where,
    include: {
      session: { select: { year: true } },
      class: { select: { name: true } },
      batch: { select: { name: true } },
      section: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      session: true,
      class: true,
      batch: true,
      section: true,
      notes: { include: { staff: true }, orderBy: { createdAt: 'desc' } },
      collections: { include: { feeMaster: true } },
      attendanceStudent: { orderBy: { date: 'desc' }, take: 30 }
    }
  })
}

// UPDATE
export async function updateStudent(id: string, data: Partial<StudentFormData>) {
  const updateData: any = { ...data }
  if (data.personal) updateData.personal = data.personal as unknown as Prisma.JsonObject
  if (data.guardian) updateData.guardian = data.guardian as unknown as Prisma.JsonObject
  if (data.address) updateData.address = data.address as unknown as Prisma.JsonObject

  return prisma.student.update({
    where: { id },
    data: updateData
  })
}

// DELETE
export async function deleteStudent(id: string) {
  return prisma.student.delete({ where: { id } })
}

// NOTES
export async function addStudentNote(data: {
  studentId: string
  staffId: string
  note: string
}) {
  return prisma.studentNote.create({ data })
}

export async function updateStudentNote(id: string, note: string) {
  return prisma.studentNote.update({
    where: { id },
    data: { note }
  })
}

export async function deleteStudentNote(id: string) {
  return prisma.studentNote.delete({ where: { id } })
}

// REPORTS
export async function getStudentReports(sessionId: string) {
  const [genderRatio, guardianList, admissionTrends] = await Promise.all([
    prisma.student.groupBy({
      by: ['personal'],
      where: { sessionId, status: 'ACTIVE' },
      _count: { id: true }
    }),
    prisma.student.findMany({
      where: { sessionId, status: 'ACTIVE' },
      select: {
        studentId: true,
        personal: true,
        guardian: true,
        class: { select: { name: true } }
      }
    }),
    prisma.student.groupBy({
      by: ['createdAt'],
      where: { sessionId },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    })
  ])

  return { genderRatio, guardianList, admissionTrends }
}