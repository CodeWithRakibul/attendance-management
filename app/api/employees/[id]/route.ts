import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { employeeQueries } from '@/queries/employees';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await employeeQueries.getById(parseInt(params.id));
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { 
      firstName, 
      lastName, 
      image, 
      designation, 
      birthDate, 
      email, 
      phone, 
      joiningDate, 
      type, 
      status, 
      deviceUserId 
    } = await request.json();
    const employeeId = parseInt(params.id);

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (image !== undefined) updateData.image = image;
    if (designation !== undefined) updateData.designation = designation;
    if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (joiningDate !== undefined) updateData.joiningDate = new Date(joiningDate);
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    if (deviceUserId !== undefined) updateData.deviceUserId = deviceUserId;

    const updatedEmployee = await employeeQueries.update(employeeId, updateData);

    revalidatePath('/dashboard/employees');
    return NextResponse.json({ success: true, data: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = parseInt(params.id);
    await employeeQueries.delete(employeeId);
    
    revalidatePath('/dashboard/employees');
    return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}