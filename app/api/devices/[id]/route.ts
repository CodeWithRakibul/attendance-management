import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: parseInt(params.id) }
    });
    
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
  { params }: { params: { id: string } }
) {
  try {
    const { ip, port, status } = await request.json();
    const deviceId = parseInt(params.id);

    const updateData: any = {};
    if (status) updateData.status = status;
    if (ip) updateData.ip = ip;
    if (port) updateData.port = parseInt(port);
    if (status === 'connected') updateData.lastConnected = new Date();

    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updatedDevice });
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
  { params }: { params: { id: string } }
) {
  try {
    const deviceId = parseInt(params.id);
    await prisma.device.delete({
      where: { id: deviceId }
    });
    
    return NextResponse.json({ success: true, message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete device' },
      { status: 500 }
    );
  }
}
