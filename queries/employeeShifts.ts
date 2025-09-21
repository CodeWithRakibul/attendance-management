import { prisma } from '@/lib/prisma';

export const employeeShiftQueries = {
  getAll: () => prisma.employeeShift.findMany({
    include: {
      employee: true,
      shift: true
    }
  }),

  getByEmployeeId: (employeeId: number) => prisma.employeeShift.findMany({
    where: { employeeId },
    include: {
      employee: true,
      shift: true
    }
  }),

  getByShiftId: (shiftId: number) => prisma.employeeShift.findMany({
    where: { shiftId },
    include: {
      employee: true,
      shift: true
    }
  }),

  create: (data: {
    employeeId: number;
    shiftId: number;
  }) => prisma.employeeShift.create({
    data: data as any,
    include: {
      employee: true,
      shift: true
    }
  }),

  delete: (employeeId: number, shiftId: number) => prisma.employeeShift.delete({
    where: {
      employeeId_shiftId: {
        employeeId,
        shiftId
      }
    }
  }),

  deleteById: (id: number) => prisma.employeeShift.delete({
    where: { id }
  })
};