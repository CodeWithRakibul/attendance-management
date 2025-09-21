import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const statusOptions = [
      { value: 'ACTIVE', label: 'Active' },
      { value: 'INACTIVE', label: 'Inactive' },
      { value: 'SUSPENDED', label: 'Suspended' },
      { value: 'TERMINATED', label: 'Terminated' }
    ];

    return NextResponse.json({ success: true, data: statusOptions });
  } catch (error) {
    console.error('Error fetching employee status options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch status options' },
      { status: 500 }
    );
  }
}