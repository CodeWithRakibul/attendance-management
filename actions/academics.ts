'use server'

import { revalidatePath } from 'next/cache'
import * as SessionQueries from '@/queries/session'
import * as ClassQueries from '@/queries/class'

// --- Sessions ---

export async function getSessionsAction() {
  try {
    return await SessionQueries.getSessions()
  } catch (error) {
    throw new Error('Failed to fetch sessions')
  }
}

export async function createSessionAction(data: { year: string }) {
  try {
    await SessionQueries.createSession(data.year)
    revalidatePath('/dashboard/academics/sessions')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create session' }
  }
}

export async function updateSessionAction(id: string, data: { year?: string; status?: 'ACTIVE' | 'CLOSED' }) {
  try {
    await SessionQueries.updateSession(id, data)
    revalidatePath('/dashboard/academics/sessions')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update session' }
  }
}

export async function deleteSessionAction(id: string) {
  try {
    await SessionQueries.deleteSession(id)
    revalidatePath('/dashboard/academics/sessions')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete session' }
  }
}

// --- Classes ---

export async function getClassesAction(sessionId: string) {
  try {
    return await ClassQueries.getClasses(sessionId)
  } catch (error) {
    throw new Error('Failed to fetch classes')
  }
}

export async function createClassAction(data: { name: string; sessionId: string }) {
  try {
    await ClassQueries.createClass(data)
    revalidatePath('/dashboard/academics/classes')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create class' }
  }
}

export async function updateClassAction(id: string, data: { name: string }) {
  try {
    await ClassQueries.updateClass(id, data)
    revalidatePath('/dashboard/academics/classes')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update class' }
  }
}

export async function deleteClassAction(id: string) {
  try {
    await ClassQueries.deleteClass(id)
    revalidatePath('/dashboard/academics/classes')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete class' }
  }
}
