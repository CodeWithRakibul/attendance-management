'use server'

import { getSession } from '@/lib/session'

import { revalidatePath } from 'next/cache'
import {
    createFeeMaster,
    getFeeMasters,
    deleteFeeMaster,
    createCollection,
    getPendingCollections,
    updateCollectionStatus,
    getStudentCollections
} from '@/queries/fee'
import { feeMasterSchema, feeCollectionSchema, type FeeMasterFormData, type FeeCollectionFormData } from '@/lib/validations'
import { prisma } from '@/lib/prisma'

// Fee Master Actions
export async function createFeeMasterAction(data: FeeMasterFormData) {
    try {
        const validated = feeMasterSchema.parse(data)
        await createFeeMaster(validated)
        revalidatePath('/dashboard/fees/setup')
        return { success: true }
    } catch (error) {
        console.error('Failed to create fee master:', error)
        return { success: false, error: 'Failed to create fee master' }
    }
}

export async function deleteFeeMasterAction(id: string) {
    try {
        await deleteFeeMaster(id)
        revalidatePath('/dashboard/fees/setup')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete fee master' }
    }
}

export async function getFeeMastersAction(sessionId: string) {
    try {
        return await getFeeMasters(sessionId)
    } catch (error) {
        throw new Error('Failed to fetch fee masters')
    }
}

// Fee Collection Actions
export async function collectFeeAction(data: FeeCollectionFormData) {
    try {
        const validated = feeCollectionSchema.parse(data)

        const session = await getSession()
        if (!session) {
            return { success: false, error: 'Unauthorized' }
        }

        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: { teacherId: true }
        })

        if (!user?.teacherId) {
            return { success: false, error: 'Only staff members can collect fees' }
        }

        await createCollection({
            ...validated,
            collectedBy: user.teacherId
        })

        revalidatePath('/dashboard/fees/collection')
        revalidatePath('/dashboard/fees/approval')
        return { success: true }
    } catch (error) {
        console.error('Failed to collect fee:', error)
        return { success: false, error: 'Failed to collect fee' }
    }
}

export async function getPendingCollectionsAction(sessionId: string) {
    try {
        return await getPendingCollections(sessionId)
    } catch (error) {
        throw new Error('Failed to fetch pending collections')
    }
}

export async function approveCollectionAction(id: string) {
    try {
        await updateCollectionStatus(id, 'APPROVED')
        revalidatePath('/dashboard/fees/approval')
        revalidatePath('/dashboard/fees/collection')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to approve collection' }
    }
}

export async function rejectCollectionAction(id: string) {
    try {
        await updateCollectionStatus(id, 'REJECTED')
        revalidatePath('/dashboard/fees/approval')
        revalidatePath('/dashboard/fees/collection')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to reject collection' }
    }
}

export async function getStudentCollectionsAction(studentId: string) {
    try {
        return await getStudentCollections(studentId)
    } catch (error) {
        throw new Error('Failed to fetch student collections')
    }
}
