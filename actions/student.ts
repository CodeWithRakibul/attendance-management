'use server'

import { revalidatePath } from 'next/cache'
import { 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  addStudentNote, 
  deleteStudentNote,
  getStudents as getStudentsQuery,
  getStudentById
} from '@/queries/student'
import { 
  getSessions,
  getCurrentSession 
} from '@/queries/session'
import { 
  getClasses as getClassesQuery,
  getBatches as getBatchesQuery,
  getSections as getSectionsQuery 
} from '@/queries/index'
import type { StudentFormData, StudentFilters } from '@/types'

export async function createStudentAction(data: StudentFormData) {
  try {
    await createStudent(data)
    revalidatePath('/dashboard/students')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create student' }
  }
}

export async function updateStudentAction(id: string, data: Partial<StudentFormData>) {
  try {
    await updateStudent(id, data)
    revalidatePath('/dashboard/students')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update student' }
  }
}

export async function deleteStudentAction(id: string) {
  try {
    await deleteStudent(id)
    revalidatePath('/dashboard/students')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete student' }
  }
}

export async function bulkDeleteStudentsAction(ids: string[]) {
  try {
    await Promise.all(ids.map(id => deleteStudent(id)))
    revalidatePath('/dashboard/students')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete students' }
  }
}

export async function updateStudentStatusAction(id: string, status: StudentFormData['status']) {
  try {
    await updateStudent(id, { status })
    revalidatePath('/dashboard/students')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update student status' }
  }
}

export async function addStudentNoteAction(data: {
  studentId: string
  staffId: string
  note: string
}) {
  try {
    await addStudentNote(data)
    revalidatePath(`/dashboard/students`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to add note' }
  }
}

export async function deleteStudentNoteAction(id: string) {
  try {
    await deleteStudentNote(id)
    revalidatePath('/dashboard/students')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete note' }
  }
}

// READ ACTIONS
export async function getStudents(sessionId: string, filters?: StudentFilters) {
  try {
    return await getStudentsQuery(sessionId, filters)
  } catch (error) {
    console.error('Error fetching students:', error)
    throw new Error(`Failed to fetch students: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getStudentByIdAction(id: string) {
  try {
    return await getStudentById(id)
  } catch (error) {
    throw new Error('Failed to fetch student')
  }
}

export { getSessions, getCurrentSession }

export async function getClasses(sessionId: string) {
  try {
    return await getClassesQuery(sessionId)
  } catch (error) {
    throw new Error('Failed to fetch classes')
  }
}

export async function getBatches(classId?: string, sessionId?: string) {
  try {
    return await getBatchesQuery(classId, sessionId)
  } catch (error) {
    throw new Error('Failed to fetch batches')
  }
}

export async function getSections(classId?: string, sessionId?: string) {
  try {
    return await getSectionsQuery(classId, sessionId)
  } catch (error) {
    throw new Error('Failed to fetch sections')
  }
}
