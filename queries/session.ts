import { prisma } from '@/lib/prisma';

export async function getSessions() {
  return prisma.session.findMany({
    orderBy: [
      { status: 'desc' }, // Active sessions first
      { createdAt: 'desc' }
    ]
  });
}

export async function getCurrentSession() {
  return prisma.session.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getSessionById(id: string) {
  return prisma.session.findUnique({
    where: { id }
  });
}

export async function createSession(year: string) {
  return prisma.session.create({
    data: { year, status: 'ACTIVE' }
  });
}

export async function updateSession(id: string, data: { year?: string; status?: 'ACTIVE' | 'CLOSED' }) {
  return prisma.session.update({
    where: { id },
    data
  });
}

export async function deleteSession(id: string) {
  return prisma.session.delete({
    where: { id }
  });
}

export async function closeSession(id: string) {
  return prisma.session.update({
    where: { id },
    data: { status: 'CLOSED' }
  });
}