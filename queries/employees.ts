import { prisma } from '@/lib/prisma';
import { EmployeeStatus, EmployeeType } from '@prisma/client';

export const employeeQueries = {
    getAll: () => prisma.employee.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: true,
            employeeShifts: { include: { shift: true } }
        } as any
    }),

    getById: (id: number) => prisma.employee.findUnique({
        where: { id },
        include: {
            user: true,
            employeeShifts: { include: { shift: true } }
        } as any
    }),

    getByEmail: (email: string) => prisma.employee.findUnique({
        where: { email },
        include: {
            user: true,
            employeeShifts: { include: { shift: true } }
        } as any
    }),

    getByDeviceUserId: (deviceUserId: string) => prisma.employee.findFirst({
        where: { deviceUserId },
        include: {
            user: true,
            employeeShifts: { include: { shift: true } }
        } as any
    }),

    create: (data: {
        userId: number;
        firstName: string;
        lastName: string;
        email: string;
        image?: string;
        designation?: string;
        birthDate?: Date;
        phone?: string;
        address?: string;
        joiningDate?: Date;
        type?: EmployeeType;
        status?: EmployeeStatus;
        deviceUserId?: string;
    }) => {
        const createData: any = {
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            type: data.type || 'FULL_TIME',
            status: data.status || 'ACTIVE'
        };
        
        if (data.image !== undefined) createData.image = data.image;
        if (data.designation !== undefined) createData.designation = data.designation;
        if (data.birthDate !== undefined) createData.birthDate = data.birthDate;
        if (data.phone !== undefined) createData.phone = data.phone;
        if (data.address !== undefined) createData.address = data.address;
        if (data.joiningDate !== undefined) createData.joiningDate = data.joiningDate;
        if (data.deviceUserId !== undefined) createData.deviceUserId = data.deviceUserId;

        return prisma.employee.create({
            data: createData,
            include: {
                user: true,
                employeeShifts: { include: { shift: true } }
            } as any
        });
    },

    update: (id: number, data: {
        firstName?: string;
        lastName?: string;
        image?: string;
        designation?: string;
        birthDate?: Date;
        email?: string;
        phone?: string;
        address?: string;
        joiningDate?: Date;
        type?: EmployeeType;
        status?: EmployeeStatus;
        deviceUserId?: string;
    }) => prisma.employee.update({
        where: { id },
        data,
        include: {
            user: true,
            employeeShifts: { include: { shift: true } }
        } as any
    }),

    delete: (id: number) => prisma.employee.delete({
        where: { id }
    }),

    deleteMany: (ids: number[]) => prisma.employee.deleteMany({
        where: { id: { in: ids } }
    }),

    // Search employees by name, email, or designation
    search: (query: string) => prisma.employee.findMany({
        where: {
            OR: [
                { firstName: { contains: query } },
                { lastName: { contains: query } },
                { email: { contains: query } },
                { designation: { contains: query } }
            ]
        },
        include: {
            user: true,
            employeeShifts: { include: { shift: true } }
        } as any,
        orderBy: { createdAt: 'desc' }
    }),

    // Get employees by status
    getByStatus: (status: EmployeeStatus) => prisma.employee.findMany({
        where: { status },
        include: {
            user: true,
            employeeShifts: { include: { shift: true } }
        } as any,
        orderBy: { createdAt: 'desc' }
    }),

    // Get employees by type
    getByType: (type: EmployeeType) => prisma.employee.findMany({
        where: { type },
        include: {
            user: true,
            employeeShifts: { include: { shift: true } }
        } as any,
        orderBy: { createdAt: 'desc' }
    })
};