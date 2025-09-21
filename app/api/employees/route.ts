import { NextRequest, NextResponse } from 'next/server';
import { employeeQueries } from '@/queries/employees';

export async function GET() {
  try {
    const employees = await employeeQueries.getAll();
    return NextResponse.json({ success: true, data: employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, phone, designation, status } = await request.json();

    if (!userId || !name) {
      return NextResponse.json(
        { success: false, error: 'UserId and name are required' },
        { status: 400 }
      );
    }

    const employee = await employeeQueries.create({
      userId: parseInt(userId),
      name,
      phone,
      designation,
      status
    });

    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    await employeeQueries.delete(parseInt(id));
    return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}