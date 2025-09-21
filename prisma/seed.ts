import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: { name: 'John Doe', email: 'john@example.com' }
    }),
    prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: { name: 'Jane Smith', email: 'jane@example.com' }
    }),
    prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: { name: 'Mike Johnson', email: 'mike@example.com' }
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: { name: 'Sarah Wilson', email: 'sarah@example.com' }
    }),
    prisma.user.upsert({
      where: { email: 'david@example.com' },
      update: {},
      create: { name: 'David Brown', email: 'david@example.com' }
    }),
    prisma.user.upsert({
      where: { email: 'lisa@example.com' },
      update: {},
      create: { name: 'Lisa Davis', email: 'lisa@example.com' }
    })
  ])

  // Create sample employees with different statuses
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        userId: users[0].id,
        name: 'John Doe',
        phone: '+1234567890',
        designation: 'Software Engineer',
        status: 'ACTIVE'
      }
    }),
    prisma.employee.create({
      data: {
        userId: users[1].id,
        name: 'Jane Smith',
        phone: '+1234567891',
        designation: 'Project Manager',
        status: 'ACTIVE'
      }
    }),
    prisma.employee.create({
      data: {
        userId: users[2].id,
        name: 'Mike Johnson',
        phone: '+1234567892',
        designation: 'UI/UX Designer',
        status: 'INACTIVE'
      }
    }),
    prisma.employee.create({
      data: {
        userId: users[3].id,
        name: 'Sarah Wilson',
        phone: '+1234567893',
        designation: 'DevOps Engineer',
        status: 'SUSPENDED'
      }
    }),
    prisma.employee.create({
      data: {
        userId: users[4].id,
        name: 'David Brown',
        phone: '+1234567894',
        designation: 'QA Engineer',
        status: 'TERMINATED'
      }
    }),
    prisma.employee.create({
      data: {
        userId: users[5].id,
        name: 'Lisa Davis',
        phone: '+1234567895',
        designation: 'Business Analyst',
        status: 'ACTIVE'
      }
    })
  ])

  // Create sample shifts
  const shifts = await Promise.all([
    prisma.shift.create({
      data: {
        name: 'Morning Shift',
        checkInTime: '09:00',
        checkOutTime: '17:00'
      }
    }),
    prisma.shift.create({
      data: {
        name: 'Night Shift',
        checkInTime: '22:00',
        checkOutTime: '06:00'
      }
    }),
    prisma.shift.create({
      data: {
        name: 'Evening Shift',
        checkInTime: '14:00',
        checkOutTime: '22:00'
      }
    })
  ])

  // Assign employees to shifts
  await Promise.all([
    prisma.employeeShift.create({
      data: { employeeId: employees[0].id, shiftId: shifts[0].id }
    }),
    prisma.employeeShift.create({
      data: { employeeId: employees[1].id, shiftId: shifts[0].id }
    }),
    prisma.employeeShift.create({
      data: { employeeId: employees[2].id, shiftId: shifts[2].id }
    }),
    prisma.employeeShift.create({
      data: { employeeId: employees[3].id, shiftId: shifts[1].id }
    }),
    prisma.employeeShift.create({
      data: { employeeId: employees[5].id, shiftId: shifts[0].id }
    })
  ])

  console.log('Seed data created successfully!')
  console.log(`Created ${users.length} users and ${employees.length} employees`)
  console.log(`Created ${shifts.length} shifts with employee assignments`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })