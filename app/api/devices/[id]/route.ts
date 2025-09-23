import { NextRequest, NextResponse } from 'next/server';
import { deviceQueries } from '@/queries/devices';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const device = await deviceQueries.getById(parseInt(id));
    
    if (!device) {
      return NextResponse.json(
        { success: false, error: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: device });
  } catch (error) {
    console.error('Error fetching device:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch device' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const device = await deviceQueries.update(parseInt(id), body);
    return NextResponse.json({ success: true, data: device });
  } catch (error) {
    console.error('Error updating device:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update device' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deviceId = parseInt(id);
    await deviceQueries.delete(deviceId);
    
    return NextResponse.json({ success: true, message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete device' },
      { status: 500 }
    );
  }
}
