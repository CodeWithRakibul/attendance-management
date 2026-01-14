'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const noteSchema = z.object({
    studentId: z.string(),
    note: z.string().min(1, 'Note cannot be empty'),
})

export async function addStudentNoteAction(data: z.infer<typeof noteSchema>) {
    try {
        const validated = noteSchema.parse(data)

        // TODO: Get actual logged in user ID
        // For now, find the first active teacher/admin
        const author = await prisma.teacher.findFirst({
            where: { status: 'ACTIVE' }
        })

        if (!author) {
            return { success: false, error: 'No active staff found to author the note' }
        }

        await prisma.studentNote.create({
            data: {
                studentId: validated.studentId,
                note: validated.note,
                staffId: author.id
            }
        })

        revalidatePath(`/dashboard/students/${validated.studentId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to add note:', error)
        return { success: false, error: 'Failed to add note' }
    }
}

export async function updateStudentNoteAction(id: string, note: string) {
    try {
        const existing = await prisma.studentNote.findUnique({
            where: { id },
            select: { studentId: true }
        })

        if (!existing) return { success: false, error: 'Note not found' }

        await prisma.studentNote.update({
            where: { id },
            data: { note }
        })

        revalidatePath(`/dashboard/students/${existing.studentId}`)
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to update note' }
    }
}

export async function deleteStudentNoteAction(id: string) {
    try {
        const existing = await prisma.studentNote.findUnique({
            where: { id },
            select: { studentId: true }
        })

        if (!existing) return { success: false, error: 'Note not found' }

        await prisma.studentNote.delete({
            where: { id }
        })

        revalidatePath(`/dashboard/students/${existing.studentId}`)
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to delete note' }
    }
}
