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
  },
  {
    firstName: 'Dr. James',
    lastName: 'Wilson',
    email: 'james.wilson@coaching.com',
    designation: 'Computer Science Professor',
    phone: '+1-555-0106',
    type: 'FULL_TIME' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    birthDate: new Date('1978-12-03'),
    joiningDate: new Date('2017-09-01'),
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    firstName: 'Ms. Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@coaching.com',
    designation: 'Spanish Language Teacher',
    phone: '+1-555-0107',
    type: 'CONTRACT' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    birthDate: new Date('1987-04-18'),
    joiningDate: new Date('2021-03-01'),
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
  },
  {
    firstName: 'Prof. Robert',
    lastName: 'Brown',
    email: 'robert.brown@coaching.com',
    designation: 'History Professor',
    phone: '+1-555-0108',
    type: 'FULL_TIME' as EmployeeType,
    status: 'ACTIVE' as EmployeeStatus,
    birthDate: new Date('1975-08-25'),
    joiningDate: new Date('2016-08-15'),
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
  }
];

async function createUserAccount(email: string, name: string) {
  try {
    // Create a user account first
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
    // Create user on ZKTeco device
    const zkUser = {
      userId: userId.toString(),
      name: `${employee.firstName} ${employee.lastName}`,
      password: '123456', // Default password
      role: 0, // Regular user role
      cardno: userId * 1000 // Generate card number based on user ID
    };

    console.log(`Creating ZKTeco user for ${employee.firstName} ${employee.lastName}...`);
    const result = await createUser(zkUser);
    
    if (result.success) {
      console.log(`✅ Successfully created ZKTeco user: ${employee.firstName} ${employee.lastName}`);
      return userId.toString(); // Return the device user ID
    } else {
      console.error(`❌ Failed to create ZKTeco user: ${result.message}`);
      return null;
    }
  } catch (error) {
    console.error(`Error creating ZKTeco user for ${employee.firstName} ${employee.lastName}:`, error);
    return null;
  }
}

async function seedTeachers() {
  console.log('🌱 Starting teacher seeding process...\n');

  try {
    // Check if we have any existing users
    const existingUsers = await prisma.user.count();
    console.log(`Found ${existingUsers} existing users in database\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const teacherData of teachersData) {
      try {
        console.log(`Creating teacher: ${teacherData.firstName} ${teacherData.lastName}`);
        
        // Step 1: Create user account
        const user = await createUserAccount(teacherData.email, `${teacherData.firstName} ${teacherData.lastName}`);
        console.log(`  ✅ User account created with ID: ${user.id}`);

        // Step 2: Create ZKTeco device user
        const deviceUserId = await createZKTecoUser(teacherData, user.id);
        
        if (deviceUserId) {
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
          successCount++;
        } else {
          console.log(`  ⚠️  Employee created without ZKTeco device integration\n`);
          errorCount++;
        }

      } catch (error) {
        console.error(`  ❌ Error creating teacher ${teacherData.firstName} ${teacherData.lastName}:`, error);
        errorCount++;
      }
    }

    console.log('\n🎉 Teacher seeding completed!');
    console.log(`✅ Successfully created: ${successCount} teachers`);
    console.log(`❌ Errors: ${errorCount} teachers`);

  } catch (error) {
    console.error('❌ Error during teacher seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedTeachers();
