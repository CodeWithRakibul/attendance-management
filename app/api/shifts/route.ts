import { NextRequest, NextResponse } from 'next/server';
import { shiftQueries } from '@/queries/shifts';

export async function GET() {
  try {
    const shifts = await shiftQueries.getAll();
    return NextResponse.json({ success: true, data: shifts });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, checkInTime, checkOutTime } = await request.json();

    if (!name || !checkInTime || !checkOutTime) {
      return NextResponse.json(
        { success: false, error: 'Name, checkInTime, and checkOutTime are required' },
        { status: 400 }
      );
    }

    const shift = await shiftQueries.create({ name, checkInTime, checkOutTime });
    return NextResponse.json({ success: true, data: shift });
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create shift' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Shift ID is required' },
        { status: 400 }
      );
    }

    await shiftQueries.delete(parseInt(id));
    return NextResponse.json({ success: true, message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete shift' },
      { status: 500 }
    );
  }
}