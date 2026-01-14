import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@prisma/client'

// Payroll Actions
export async function getSalaryPayments(teacherId?: string) {
    return await prisma.salaryPayment.findMany({
        where: teacherId ? { teacherId } : {},
        include: {
            teacher: {
                select: {
                    personal: true,
                    designation: true,
                    staffId: true
                }
            }
        },
        orderBy: { paymentDate: 'desc' }
    })
}

export async function createSalaryPayment(data: {
    teacherId: string,
    month: string,
    amount: number,
    paymentDate: Date,
    status?: PaymentStatus
}) {
    return await prisma.salaryPayment.create({
        data: {
            teacherId: data.teacherId,
            month: data.month,
            amount: data.amount,
            paymentDate: data.paymentDate,
            status: data.status || 'PAID'
        }
    })
}

// Helper to calculate totals
export async function getPayrollStats() {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    
    const monthlyTotal = await prisma.salaryPayment.aggregate({
        where: { month: currentMonth, status: 'PAID' },
        _sum: { amount: true }
    })

    return {
        monthlyTotal: monthlyTotal._sum.amount || 0
    }
}
