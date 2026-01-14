import { prisma } from '@/lib/prisma'

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

export async function getClassById(id: string) {
  return prisma.class.findUnique({
    where: { id },
    include: {
      batches: true,
      sections: true
    }
  })
}

export async function createClass(data: { name: string; sessionId: string }) {
  return prisma.class.create({
    data
  })
}

export async function updateClass(id: string, data: { name: string }) {
  return prisma.class.update({
    where: { id },
    data
  })
}

export async function deleteClass(id: string) {
  return prisma.class.delete({
    where: { id }
  })
}
