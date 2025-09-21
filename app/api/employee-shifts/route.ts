import { NextRequest, NextResponse } from 'next/server';
import { employeeShiftQueries } from '@/queries/employeeShifts';

export async function GET() {
  try {
    const employeeShifts = await employeeShiftQueries.getAll();
    return NextResponse.json({ success: true, data: employeeShifts });
  } catch (error) {
    console.error('Error fetching employee shifts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee shifts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { employeeId, shiftId } = await request.json();

    if (!employeeId || !shiftId) {
      return NextResponse.json(
        { success: false, error: 'EmployeeId and shiftId are required' },
        { status: 400 }
      );
    }

    const employeeShift = await employeeShiftQueries.create({
      employeeId: parseInt(employeeId),
      shiftId: parseInt(shiftId)
    });

    return NextResponse.json({ success: true, data: employeeShift });
  } catch (error) {
    console.error('Error assigning employee to shift:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign employee to shift' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { employeeId, shiftId } = await request.json();

    if (!employeeId || !shiftId) {
      return NextResponse.json(
        { success: false, error: 'EmployeeId and shiftId are required' },
        { status: 400 }
      );
    }

    await employeeShiftQueries.delete(parseInt(employeeId), parseInt(shiftId));
    return NextResponse.json({ success: true, message: 'Employee removed from shift' });
  } catch (error) {
    console.error('Error removing employee from shift:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove employee from shift' },
      { status: 500 }
    );
  }
}