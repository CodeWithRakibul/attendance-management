import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, ip, port } = await request.json();

    if (!name || !ip || !port) {
      return NextResponse.json(
        { success: false, error: 'Name, IP, and port are required' },
        { status: 400 }
      );
    }

    const device = await prisma.device.create({
      data: {
        name,
        ip,
        port: parseInt(port),
        status: 'disconnected'
      }
    });

    return NextResponse.json({ success: true, data: device });
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create device' },
      { status: 500 }
    );
  }
}
