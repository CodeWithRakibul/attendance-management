'use server';

import { revalidatePath } from 'next/cache';
import { employeeQueries } from '@/queries/employees';
import { EmployeeStatus, EmployeeType } from '@prisma/client';

export async function createEmployee(data: {
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
}) {
  try {
    const employee = await employeeQueries.create(data);
    revalidatePath('/dashboard/employees');
    return { success: true, data: employee };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
}

export async function updateEmployee(id: number, data: {
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
}) {
  try {
    const employee = await employeeQueries.update(id, data);
    revalidatePath('/dashboard/employees');
    return { success: true, data: employee };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: 'Failed to update employee' };
  }
}

export async function deleteEmployee(id: number) {
  try {
    await employeeQueries.delete(id);
    revalidatePath('/dashboard/employees');
    return { success: true };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { success: false, error: 'Failed to delete employee' };
  }
}

export async function deleteMultipleEmployees(ids: number[]) {
  try {
    await employeeQueries.deleteMany(ids);
    revalidatePath('/dashboard/employees');
    return { success: true };
  } catch (error) {
    console.error('Error deleting employees:', error);
    return { success: false, error: 'Failed to delete employees' };
  }
}