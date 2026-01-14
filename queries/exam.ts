import { prisma } from '@/lib/prisma'

// Exam CRUD
export async function createExam(data: {
  name: string
  sessionId: string
  startDate: Date
  endDate: Date
}) {
  return await prisma.exam.create({
    data: {
      name: data.name,
      sessionId: data.sessionId,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  })
}

export async function getExams(sessionId: string) {
  return await prisma.exam.findMany({
    where: { sessionId },
    orderBy: { startDate: 'desc' },
    include: {
      _count: {
        select: { schedules: true }
      }
    }
  })
}

export async function getExamById(id: string) {
  return await prisma.exam.findUnique({
    where: { id },
    include: {

        schedules: {
            include: {
                class: true
            },
            orderBy: { date: 'asc' }
        }
    }
  })
}

// Exam Schedule CRUD
export async function createExamSchedule(data: {
  examId: string
  classId: string
  subject: string
  date: Date
  startTime: string
  endTime: string
  fullMark: number
}) {
  return await prisma.examSchedule.create({
    data: {
        examId: data.examId,
        classId: data.classId,
        subject: data.subject,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        fullMark: data.fullMark
    }
  })
}

export async function getExamSchedule(id: string) {
    return await prisma.examSchedule.findUnique({
        where: { id },
        include: {
            class: true,
            exam: true,
            marks: {
                include: {
                    student: {
                        include: {

                        }
                    }
                }
            }
        }
    })
}

// Marks Management
export async function updateExamMarks(scheduleId: string, marks: { studentId: string, marksObtained: number, isAbsent: boolean }[]) {
    // Transaction to update multiple marks
    return await prisma.$transaction(
        marks.map(mark => 
            prisma.examMark.upsert({
                where: {
                    examScheduleId_studentId: {
                        examScheduleId: scheduleId,
                        studentId: mark.studentId
                    }
                },
                update: {
                    marksObtained: mark.marksObtained,
                    isAbsent: mark.isAbsent
                },
                create: {
                    examScheduleId: scheduleId,
                    studentId: mark.studentId,
                    marksObtained: mark.marksObtained,
                    isAbsent: mark.isAbsent
                }
            })
        )
    )
}
