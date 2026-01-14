'use server'

import { revalidatePath } from 'next/cache'
import { createExam, createExamSchedule, updateExamMarks } from '@/queries/exam'
import { z } from 'zod'

const examSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sessionId: z.string().min(1, 'Session is required'),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
})

const scheduleSchema = z.object({
  examId: z.string().min(1, 'Exam ID is required'),
  classId: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  date: z.string().transform(str => new Date(str)),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  fullMark: z.coerce.number().min(1, 'Full mark must be positive'),
})

export async function createExamAction(formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        sessionId: formData.get('sessionId'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
    }

    try {
        const validated = examSchema.parse(rawData)
        await createExam(validated)
        revalidatePath('/dashboard/exams')
        return { success: true }
    } catch (e) {
        return { success: false, error: 'Failed to create exam' }
    }
}

export async function createScheduleAction(formData: FormData) {
    const rawData = {
        examId: formData.get('examId'),
        classId: formData.get('classId'),
        subject: formData.get('subject'),
        date: formData.get('date'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        fullMark: formData.get('fullMark'),
    }

    try {
        const validated = scheduleSchema.parse(rawData)
        await createExamSchedule(validated)
        revalidatePath(`/dashboard/exams/${validated.examId}`)
        return { success: true }
    } catch (e) {
        return { success: false, error: 'Failed to schedule exam' }
    }
}

export async function updateMarksAction(scheduleId: string, marks: any[]) {
    try {
        await updateExamMarks(scheduleId, marks)
        revalidatePath(`/dashboard/exams/marks/${scheduleId}`)
        return { success: true }
    } catch (e) {
        return { success: false, error: 'Failed to update marks' }
    }
}
