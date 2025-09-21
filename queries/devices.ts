import { prisma } from '@/lib/prisma';

export const deviceQueries = {
  getAll: () => prisma.device.findMany({
    orderBy: { createdAt: 'desc' }
  }),

  getById: (id: number) => prisma.device.findUnique({
    where: { id }
  }),

  create: (data: {
    name: string;
    ip: string;
    port: number;
    status?: string;
  }) => prisma.device.create({
    data: {
      name: data.name,
      ip: data.ip,
      port: data.port,
      status: data.status || 'disconnected'
    }
  }),

  update: (id: number, data: {
    name?: string;
    ip?: string;
    port?: number;
    status?: string;
    lastConnected?: Date;
  }) => prisma.device.update({
    where: { id },
    data: data as any
  }),

  delete: (id: number) => prisma.device.delete({
    where: { id }
  })
};