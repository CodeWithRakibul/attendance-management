import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  })

  // Create sample employees
  const employee1 = await prisma.employee.create({
    data: {
      userId: user1.id,
      name: 'John Doe',
      phone: '+1234567890',
      designation: 'Software Engineer',
      status: 'ACTIVE'
    }
  })

  const employee2 = await prisma.employee.create({
    data: {
      userId: user2.id,
      name: 'Jane Smith',
      phone: '+1234567891',
      designation: 'Project Manager',
      status: 'ACTIVE'
    }
  })

  // Create sample shifts
  const morningShift = await prisma.shift.create({
    data: {
      name: 'Morning Shift',
      checkInTime: '09:00',
      checkOutTime: '17:00'
    }
  })

  const nightShift = await prisma.shift.create({
    data: {
      name: 'Night Shift',
      checkInTime: '22:00',
      checkOutTime: '06:00'
    }
  })

  // Assign employees to shifts
  await prisma.employeeShift.create({
    data: {
      employeeId: employee1.id,
      shiftId: morningShift.id
    }
  })

  await prisma.employeeShift.create({
    data: {
      employeeId: employee2.id,
      shiftId: nightShift.id
    }
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })