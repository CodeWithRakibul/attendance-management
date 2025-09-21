import { prisma } from '@/lib/prisma';

type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';

export const employeeQueries = {
    getAll: () => prisma.employee.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
            shifts: { include: { shift: true } }
        }
    }),

    getById: (id: number) => prisma.employee.findUnique({
        where: { id },
        include: {
            user: true,
            shifts: { include: { shift: true } }
        }
    }),

    create: (data: {
        userId: number;
        name: string;
        phone?: string;
        designation?: string;
        status?: EmployeeStatus;
    }) => {
        const createData: any = {
            userId: data.userId,
            name: data.name,
            status: data.status || 'ACTIVE'
        };
        if (data.phone !== undefined) createData.phone = data.phone;
        if (data.designation !== undefined) createData.designation = data.designation;

        return prisma.employee.create({
            data: createData,
            include: {
                user: true,
                shifts: { include: { shift: true } }
            }
        });
    },

    update: (id: number, data: {
        name?: string;
        phone?: string;
        designation?: string;
        status?: EmployeeStatus;
    }) => prisma.employee.update({
        where: { id },
        data,
        include: {
            user: true,
            shifts: { include: { shift: true } }
        }
    }),

    delete: (id: number) => prisma.employee.delete({
        where: { id }
    })
};