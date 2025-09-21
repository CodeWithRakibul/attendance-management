import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, EmployeeType, EmployeeStatus } from '@prisma/client';
import { createUser } from '@/lib/zk/users';

const prisma = new PrismaClient();

// Sample teacher data
const teachersData = [
  {
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@coaching.com',
    designation: 'Mathematics Professor',
    phone: '+1-555-0101',
    type: 'FULL_TIME' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    birthDate: new Date('1985-03-15'),
    joiningDate: new Date('2020-09-01'),
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    firstName: 'Prof. Michael',
    lastName: 'Chen',
    email: 'michael.chen@coaching.com',
    designation: 'Physics Instructor',
    phone: '+1-555-0102',
    type: 'FULL_TIME' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    birthDate: new Date('1982-07-22'),
    joiningDate: new Date('2019-08-15'),
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    firstName: 'Dr. Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@coaching.com',
    designation: 'Chemistry Professor',
    phone: '+1-555-0103',
    type: 'FULL_TIME' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    birthDate: new Date('1988-11-08'),
    joiningDate: new Date('2021-01-10'),
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    firstName: 'Mr. David',
    lastName: 'Kim',
    email: 'david.kim@coaching.com',
    designation: 'English Literature Teacher',
    phone: '+1-555-0104',
    type: 'FULL_TIME' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    birthDate: new Date('1980-05-12'),
    joiningDate: new Date('2018-06-01'),
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    firstName: 'Ms. Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@coaching.com',
    designation: 'Biology Teacher',
    phone: '+1-555-0105',
    type: 'PART_TIME' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    birthDate: new Date('1990-09-30'),
    joiningDate: new Date('2022-02-15'),
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  }
];

async function createUserAccount(email: string, name: string) {
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
      }
    });
    return user;
  } catch (error) {
    console.error(`Error creating user account for ${email}:`, error);
    throw error;
  }
}

async function createZKTecoUser(employee: any, userId: number) {
  try {
    const zkUser = {
      userId: userId.toString(),
      name: `${employee.firstName} ${employee.lastName}`,
      password: '123456',
      role: 0,
      cardno: userId * 1000
    };

    console.log(`Creating ZKTeco user for ${employee.firstName} ${employee.lastName}...`);
    const result = await createUser(zkUser);
    
    if (result.success) {
      console.log(`✅ Successfully created ZKTeco user: ${employee.firstName} ${employee.lastName}`);
      return userId.toString();
    } else {
      console.error(`❌ Failed to create ZKTeco user: ${result.message}`);
      // Return a mock device user ID for testing purposes when device is not available
      console.log(`⚠️  Using mock device user ID for testing: ${userId}`);
      return `MOCK_${userId}`;
    }
  } catch (error) {
    console.error(`Error creating ZKTeco user for ${employee.firstName} ${employee.lastName}:`, error);
    // Return a mock device user ID for testing purposes when device is not available
    console.log(`⚠️  Using mock device user ID for testing: ${userId}`);
    return `MOCK_${userId}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Starting teacher seeding process...\n');

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    for (const teacherData of teachersData) {
      try {
        console.log(`Creating teacher: ${teacherData.firstName} ${teacherData.lastName}`);
        
        // Step 1: Create user account
        const user = await createUserAccount(teacherData.email, `${teacherData.firstName} ${teacherData.lastName}`);
        console.log(`  ✅ User account created with ID: ${user.id}`);

        // Step 2: Create ZKTeco device user (or mock ID if device unavailable)
        const deviceUserId = await createZKTecoUser(teacherData, user.id);
        
        // Step 3: Create employee record with device user ID
        const employee = await prisma.employee.create({
          data: {
            userId: user.id,
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            email: teacherData.email,
            image: teacherData.image,
            designation: teacherData.designation,
            birthDate: teacherData.birthDate,
            phone: teacherData.phone,
            joiningDate: teacherData.joiningDate,
            type: teacherData.type,
            status: teacherData.status,
            deviceUserId: deviceUserId
          }
        });

        console.log(`  ✅ Employee record created with ID: ${employee.id}`);
        console.log(`  ✅ Device User ID: ${deviceUserId}\n`);
        
        results.push({
          success: true,
          employee: {
            id: employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            email: employee.email,
            deviceUserId: deviceUserId,
            designation: employee.designation,
            type: employee.type,
            status: employee.status
          }
        });
        successCount++;

      } catch (error) {
        console.error(`  ❌ Error creating teacher ${teacherData.firstName} ${teacherData.lastName}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          employee: {
            name: `${teacherData.firstName} ${teacherData.lastName}`,
            email: teacherData.email
          }
        });
        errorCount++;
      }
    }

    console.log('\n🎉 Teacher seeding completed!');
    console.log(`✅ Successfully created: ${successCount} teachers`);
    console.log(`❌ Errors: ${errorCount} teachers`);

    return NextResponse.json({
      success: true,
      message: 'Teacher seeding completed',
      summary: {
        total: teachersData.length,
        successful: successCount,
        errors: errorCount
      },
      results: results
    });

  } catch (error) {
    console.error('❌ Error during teacher seeding:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed teachers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
