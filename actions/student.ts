'use server'

import { revalidatePath } from 'next/cache'
import { 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  addStudentNote, 
  deleteStudentNote 
} from '@/queries/student'
import type { StudentFormData } from '@/types'

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