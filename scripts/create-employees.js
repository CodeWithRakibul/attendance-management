// Script to create employees using existing users
const employees = [
  {
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@coaching.com',
    designation: 'Mathematics Professor',
    phone: '+1-555-0101',
    type: 'FULL_TIME',
    status: 'ACTIVE',
    birthDate: '1985-03-15',
    joiningDate: '2020-09-01',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    deviceUserId: 'MOCK_1'
  },
  {
    firstName: 'Prof. Michael',
    lastName: 'Chen',
    email: 'michael.chen@coaching.com',
    designation: 'Physics Instructor',
    phone: '+1-555-0102',
    type: 'FULL_TIME',
    status: 'ACTIVE',
    birthDate: '1982-07-22',
    joiningDate: '2019-08-15',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    deviceUserId: 'MOCK_2'
  },
  {
    firstName: 'Dr. Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@coaching.com',
    designation: 'Chemistry Professor',
    phone: '+1-555-0103',
    type: 'FULL_TIME',
    status: 'ACTIVE',
    birthDate: '1988-11-08',
    joiningDate: '2021-01-10',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    deviceUserId: 'MOCK_3'
  },
  {
    firstName: 'Mr. David',
    lastName: 'Kim',
    email: 'david.kim@coaching.com',
    designation: 'English Literature Teacher',
    phone: '+1-555-0104',
    type: 'FULL_TIME',
    status: 'ACTIVE',
    birthDate: '1980-05-12',
    joiningDate: '2018-06-01',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    deviceUserId: 'MOCK_4'
  },
  {
    firstName: 'Ms. Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@coaching.com',
    designation: 'Biology Teacher',
    phone: '+1-555-0105',
    type: 'PART_TIME',
    status: 'ACTIVE',
    birthDate: '1990-09-30',
    joiningDate: '2022-02-15',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    deviceUserId: 'MOCK_5'
  }
];

async function createEmployees() {
  console.log('🌱 Creating employees...\n');
  
  // First, get all users
  const usersResponse = await fetch('http://localhost:3000/api/users');
  const usersResult = await usersResponse.json();
  
  if (!usersResult.success) {
    console.error('Failed to fetch users:', usersResult.error);
    return;
  }
  
  console.log(`Found ${usersResult.data.length} users in database\n`);
  
  for (let i = 0; i < employees.length && i < usersResult.data.length; i++) {
    const employee = employees[i];
    const user = usersResult.data[i];
    
    try {
      console.log(`Creating employee: ${employee.firstName} ${employee.lastName} for user ID: ${user.id}`);
      
      const employeeResponse = await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          image: employee.image,
          designation: employee.designation,
          birthDate: employee.birthDate,
          phone: employee.phone,
          joiningDate: employee.joiningDate,
          type: employee.type,
          status: employee.status,
          deviceUserId: employee.deviceUserId
        })
      });
      
      const employeeResult = await employeeResponse.json();
      
      if (employeeResult.success) {
        console.log(`  ✅ Employee created with ID: ${employeeResult.data.id}`);
        console.log(`  ✅ Device User ID: ${employee.deviceUserId}\n`);
      } else {
        console.log(`  ❌ Failed to create employee: ${employeeResult.error}\n`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error creating employee ${employee.firstName} ${employee.lastName}:`, error);
    }
  }
  
  console.log('🎉 Employee creation completed!');
}

createEmployees();
