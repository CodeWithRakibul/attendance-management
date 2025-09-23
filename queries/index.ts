// Export all query functions for easy importing
export * from './dashboard'
export * from './student'
export * from './teacher'
export * from './attendance'
export * from './report'

// Additional utility queries
import { prisma } from '@/lib/prisma'
import type { Session, FeeType, PaymentMethod } from '@/types'

// Session management
export async function getCurrentSession() {
  return prisma.session.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createSession(year: string) {
  return prisma.session.create({
    data: { year, status: 'ACTIVE' }
  })
}

export async function closeSession(id: string) {
  return prisma.session.update({
    where: { id },
    data: { status: 'CLOSED' }
  })
}

// Academic structure
export async function getClasses(sessionId: string) {
  return prisma.class.findMany({
    where: { sessionId },
    include: {
      batches: true,
      sections: true,
      _count: { select: { students: true } }
    },
    orderBy: { name: 'asc' }
  })
}

export async function getBatches(classId?: string, sessionId?: string) {
  const where: any = {}
  if (classId) where.classId = classId
  if (sessionId) where.sessionId = sessionId

  return prisma.batch.findMany({
    where,
    include: {
      class: true,
      _count: { select: { students: true } }
    },
    orderBy: { name: 'asc' }
  })
}

export async function getSections(classId?: string, sessionId?: string) {
  const where: any = {}
  if (classId) where.classId = classId
  if (sessionId) where.sessionId = sessionId

  return prisma.section.findMany({
    where,
    include: {
      class: true,
      _count: { select: { students: true } }
    },
    orderBy: { name: 'asc' }
  })
}

// Fee management
export async function getFeeMasters(sessionId: string) {
  return prisma.feeMaster.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createFeeMaster(data: {
  sessionId: string
  name: string
  amount: number
  type: FeeType
  groupId?: string
  dueDate?: Date
}) {
  return prisma.feeMaster.create({ data })
}

// Collection management
export async function createCollection(data: {
  studentId: string
  sessionId: string
  feeMasterId: string
  amount: number
  method?: PaymentMethod
  collectedBy: string
}) {
  return prisma.collection.create({ data })
}

export async function approveCollection(id: string, approvedBy: string) {
  return prisma.collection.update({
    where: { id },
    data: {
      status: 'APPROVED',
      collectedAt: new Date(),
      receiptNo: `RCP-${Date.now()}`
    }
  })
}