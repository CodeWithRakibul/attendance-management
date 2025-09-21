import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { connectToDevice } from '@/lib/zk/zk';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { ip, port } = await request.json();
    const deviceId = parseInt(params.id);

    if (!ip || !port) {
      return NextResponse.json(
        { success: false, error: 'IP and port are required' },
        { status: 400 }
      );
    }

    // Update device connection info
    await prisma.device.update({
      where: { id: deviceId },
      data: { ip, port: parseInt(port) }
    });

    // Log connection attempt
    await prisma.deviceConnection.create({
      data: {
        deviceId,
        status: 'attempting'
      }
    });

    try {
      // Attempt to connect using the improved ZK function
      const connected = await connectToDevice(ip, port);
      
      if (connected) {
        // Update device status to connected
        await prisma.device.update({
          where: { id: deviceId },
          data: { status: 'connected', lastConnected: new Date() }
        });
        
        // Log successful connection
        await prisma.deviceConnection.create({
          data: {
            deviceId,
            status: 'connected'
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Connected successfully',
          data: { connected: true, ip, port }
        });
      } else {
        // Update device status to failed
        await prisma.device.update({
          where: { id: deviceId },
          data: { status: 'failed' }
        });
        
        // Log failed connection
        await prisma.deviceConnection.create({
          data: {
            deviceId,
            status: 'failed',
            errorMessage: 'Connection timeout'
          }
        });
        
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to connect to device' 
        });
      }
    } catch (connectionError) {
      // Update device status to error
      await prisma.device.update({
        where: { id: deviceId },
        data: { status: 'error' }
      });
      
      // Log connection error
      const errorMessage = connectionError instanceof Error ? connectionError.message : 'Unknown connection error';
      await prisma.deviceConnection.create({
        data: {
          deviceId,
          status: 'error',
          errorMessage
        }
      });
      
      return NextResponse.json({ 
        success: false, 
        error: `Connection error: ${errorMessage}` 
      });
    }
  } catch (error) {
    console.error('Error connecting to device:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process connection request' },
      { status: 500 }
    );
  }
}
