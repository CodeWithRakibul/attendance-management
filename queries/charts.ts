import { prisma } from '@/lib/prisma'

export async function getAdmissionTrendsData() {
  const currentYear = new Date().getFullYear()
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const data = await Promise.all(
    months.map(async (month, index) => {
      const startDate = new Date(currentYear, index, 1)
      const endDate = new Date(currentYear, index + 1, 0)
      
      const students = await prisma.student.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      })

      return {
        month,
        students,
        target: 50 + (index * 2) // Dynamic target
      }
    })
  )

  return data
}

export async function getCollectionVsExpenseData() {
  const currentYear = new Date().getFullYear()
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const data = await Promise.all(
    months.map(async (month, index) => {
      const startDate = new Date(currentYear, index, 1)
      const endDate = new Date(currentYear, index + 1, 0)
      
      const collections = await prisma.collection.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          status: 'APPROVED'
        },
        _sum: { amount: true }
      })

      return {
        month,
        collection: collections._sum.amount || 0,
        expense: Math.floor((collections._sum.amount || 0) * 0.7) // Estimated expense
      }
    })
  )

  return data
}

export async function getTodayAttendanceData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const [totalStudents, presentStudents] = await Promise.all([
    prisma.student.count({ where: { status: 'ACTIVE' } }),
    prisma.attendanceStudent.count({
      where: {
        date: today,
        status: 'PRESENT'
      }
    })
  ])

  const absentStudents = totalStudents - presentStudents
  const presentPercentage = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0
  const absentPercentage = totalStudents > 0 ? Math.round((absentStudents / totalStudents) * 100) : 0

  return [
    { name: 'Present', value: presentPercentage, color: '#10b981' },
    { name: 'Absent', value: absentPercentage, color: '#ef4444' },
    { name: 'Late', value: Math.max(0, 100 - presentPercentage - absentPercentage), color: '#f59e0b' }
  ]
}

export async function getClassWiseAttendanceData() {
  const classes = await prisma.class.findMany({
    include: {
      students: {
        where: { status: 'ACTIVE' }
      }
    }
  })

  const data = await Promise.all(
    classes.map(async (cls) => {
      const totalStudents = cls.students.length
      if (totalStudents === 0) return { class: cls.name, attendance: 0 }

      const presentStudents = await prisma.attendanceStudent.count({
        where: {
          student: {
            classId: cls.id,
            status: 'ACTIVE'
          },
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          },
          status: 'PRESENT'
        }
      })

      const totalDays = 30
      const attendancePercentage = Math.round((presentStudents / (totalStudents * totalDays)) * 100)

      return {
        class: cls.name,
        attendance: Math.min(attendancePercentage, 100)
      }
    })
  )

  return data.filter(item => item.attendance > 0)
}