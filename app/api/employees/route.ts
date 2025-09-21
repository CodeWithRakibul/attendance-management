import { NextRequest, NextResponse } from 'next/server';
import { employeeQueries } from '@/queries/employees';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let employees;

    if (search) {
      employees = await employeeQueries.search(search);
    } else if (status) {
      employees = await employeeQueries.getByStatus(status as any);
    } else if (type) {
      employees = await employeeQueries.getByType(type as any);
    } else {
      employees = await employeeQueries.getAll();
    }

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
    const { 
      userId, 
      firstName, 
      lastName, 
      email, 
      image, 
      designation, 
      birthDate, 
      phone, 
      joiningDate, 
      type, 
      status, 
      deviceUserId 
    } = await request.json();

    if (!userId || !firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, error: 'UserId, firstName, lastName, and email are required' },
        { status: 400 }
      );
    }

    const employee = await employeeQueries.create({
      userId: parseInt(userId),
      firstName,
      lastName,
      email,
      image,
      designation,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      phone,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      type,
      status,
      deviceUserId
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

export async function PUT(request: NextRequest) {
  try {
    const { 
      id, 
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

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

    const employee = await employeeQueries.update(parseInt(id), updateData);
    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, ids } = await request.json();

    // Handle multiple delete
    if (ids && Array.isArray(ids)) {
      if (ids.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No employee IDs provided' },
          { status: 400 }
        );
      }

      const numericIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
      if (numericIds.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid employee IDs provided' },
          { status: 400 }
        );
      }

      const result = await employeeQueries.deleteMany(numericIds);
      return NextResponse.json({ 
        success: true, 
        message: `${result.count} employee(s) deleted successfully`,
        deletedCount: result.count
      });
    }

    // Handle single delete
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID or IDs are required' },
        { status: 400 }
      );
    }

    await employeeQueries.delete(parseInt(id));
    return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee(s):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete employee(s)' },
      { status: 500 }
    );
  }
}