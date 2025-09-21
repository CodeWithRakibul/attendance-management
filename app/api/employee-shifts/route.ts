import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { employeeId, shiftId } = await request.json();

    if (!employeeId || !shiftId) {
      return NextResponse.json(
        { success: false, error: 'EmployeeId and shiftId are required' },
        { status: 400 }
      );
    }

    const employeeShift = await prisma.employeeShift.create({
      data: {
        employeeId: parseInt(employeeId),
        shiftId: parseInt(shiftId)
      },
      include: {
        employee: true,
        shift: true
      }
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

    await prisma.employeeShift.delete({
      where: {
        employeeId_shiftId: {
          employeeId: parseInt(employeeId),
          shiftId: parseInt(shiftId)
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Employee removed from shift' });
  } catch (error) {
    console.error('Error removing employee from shift:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove employee from shift' },
      { status: 500 }
    );
  }
}