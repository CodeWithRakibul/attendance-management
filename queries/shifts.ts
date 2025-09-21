import { prisma } from '@/lib/prisma';

export const shiftQueries = {
  getAll: () => prisma.shift.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      employees: { include: { employee: true } }
    }
  }),

  getById: (id: number) => prisma.shift.findUnique({
    where: { id },
    include: {
      employees: { include: { employee: true } }
    }
  }),

  create: (data: {
    name: string;
    checkInTime: string;
    checkOutTime: string;
  }) => prisma.shift.create({
    data: data as any
  }),

  update: (id: number, data: {
    name?: string;
    checkInTime?: string;
    checkOutTime?: string;
  }) => prisma.shift.update({
    where: { id },
    data
  }),

  delete: (id: number) => prisma.shift.delete({
    where: { id }
  })
};