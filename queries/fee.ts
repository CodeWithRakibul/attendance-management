import { prisma } from '@/lib/prisma'
import type { FeeMasterFormData, FeeCollectionFormData } from '@/lib/validations'

// Fee Master Queries
export async function createFeeMaster(data: FeeMasterFormData) {
    return await prisma.feeMaster.create({
        data: {
            sessionId: data.sessionId,
            name: data.name,
            amount: data.amount,
            type: data.type,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
        },
    })
}

export async function getFeeMasters(sessionId: string) {
    return await prisma.feeMaster.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
    })
}

export async function deleteFeeMaster(id: string) {
    return await prisma.feeMaster.delete({
        where: { id },
    })
}

// Fee Collection Queries
export async function createCollection(data: FeeCollectionFormData & { collectedBy: string }) {
    return await prisma.collection.create({
        data: {
            studentId: data.studentId,
            sessionId: data.sessionId,
            feeMasterId: data.feeMasterId,
            amount: data.amount,
            method: data.method,
            receiptNo: data.receiptNo,
            collectedBy: data.collectedBy,
            status: 'PENDING', // Maker-Checker: Default PENDING
        },
    })
}

export async function getPendingCollections(sessionId: string) {
    return await prisma.collection.findMany({
        where: {
            sessionId,
            status: 'PENDING',
        },
        include: {
            student: {
                select: {
                    studentId: true,
                    personal: true,
                    roll: true,
                    class: { select: { name: true } },
                },
            },
            feeMaster: {
                select: { name: true, type: true },
            },
            collector: {
                select: { personal: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    })
}

export async function updateCollectionStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    return await prisma.collection.update({
        where: { id },
        data: {
            status,
            collectedAt: status === 'APPROVED' ? new Date() : null, // Set collectedAt when approved
        },
    })
}

export async function getStudentCollections(studentId: string) {
    return await prisma.collection.findMany({
        where: { studentId },
        include: {
            feeMaster: true,
            collector: {
                select: { personal: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}
