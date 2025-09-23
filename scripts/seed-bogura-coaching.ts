import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Bogura Coaching Center data...')

  // Create Session
  const session = await prisma.session.create({
    data: {
      year: '2025',
      status: 'ACTIVE'
    }
  })

  // Create Classes
  const classes = await Promise.all([
    prisma.class.create({
      data: { name: 'Class 6', sessionId: session.id }
    }),
    prisma.class.create({
      data: { name: 'Class 7', sessionId: session.id }
    }),
    prisma.class.create({
      data: { name: 'Class 8', sessionId: session.id }
    }),
    prisma.class.create({
      data: { name: 'Class 9', sessionId: session.id }
    }),
    prisma.class.create({
      data: { name: 'Class 10', sessionId: session.id }
    }),
    prisma.class.create({
      data: { name: 'HSC 1st Year', sessionId: session.id }
    }),
    prisma.class.create({
      data: { name: 'HSC 2nd Year', sessionId: session.id }
    })
  ])

  // Create Batches
  const batches = []
  for (const cls of classes) {
    const classBatches = await Promise.all([
      prisma.batch.create({
        data: {
          name: 'Morning Batch',
          classId: cls.id,
          sessionId: session.id,
          timeSlot: '8:00 AM - 12:00 PM'
        }
      }),
      prisma.batch.create({
        data: {
          name: 'Evening Batch',
          classId: cls.id,
          sessionId: session.id,
          timeSlot: '2:00 PM - 6:00 PM'
        }
      })
    ])
    batches.push(...classBatches)
  }

  // Create Sections
  const sections = []
  for (const cls of classes) {
    const classSections = await Promise.all([
      prisma.section.create({
        data: { name: 'A', classId: cls.id, sessionId: session.id }
      }),
      prisma.section.create({
        data: { name: 'B', classId: cls.id, sessionId: session.id }
      })
    ])
    sections.push(...classSections)
  }

  // Create Teachers
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        staffId: 'TCH001',
        sessionId: session.id,
        designation: 'Head Teacher',
        subjects: ['Mathematics', 'Physics'],
        qualification: 'MSc in Mathematics',
        experience: '15 years',
        personal: {
          nameBn: 'মোহাম্মদ রহিম উদ্দিন',
          nameEn: 'Mohammad Rahim Uddin',
          dob: '1978-05-15',
          gender: 'MALE',
          bloodGroup: 'B+'
        },
        contact: {
          mobile: '01712345678',
          email: 'rahim@boguracoaching.com'
        },
        address: {
          present: 'Satmatha, Bogura',
          permanent: 'Satmatha, Bogura'
        },
        salaryInfo: {
          basicSalary: 35000,
          allowances: { transport: 3000, medical: 2000 }
        },
        status: 'ACTIVE'
      }
    }),
    prisma.teacher.create({
      data: {
        staffId: 'TCH002',
        sessionId: session.id,
        designation: 'Senior Teacher',
        subjects: ['English', 'Bangla'],
        qualification: 'MA in English',
        experience: '12 years',
        personal: {
          nameBn: 'ফাতেমা খাতুন',
          nameEn: 'Fatema Khatun',
          dob: '1982-08-22',
          gender: 'FEMALE',
          bloodGroup: 'A+'
        },
        contact: {
          mobile: '01723456789',
          email: 'fatema@boguracoaching.com'
        },
        address: {
          present: 'Thanthania, Bogura',
          permanent: 'Thanthania, Bogura'
        },
        salaryInfo: {
          basicSalary: 28000,
          allowances: { transport: 2500, medical: 1500 }
        },
        status: 'ACTIVE'
      }
    }),
    prisma.teacher.create({
      data: {
        staffId: 'TCH003',
        sessionId: session.id,
        designation: 'Assistant Teacher',
        subjects: ['Chemistry', 'Biology'],
        qualification: 'MSc in Chemistry',
        experience: '8 years',
        personal: {
          nameBn: 'আব্দুল করিম',
          nameEn: 'Abdul Karim',
          dob: '1985-12-10',
          gender: 'MALE',
          bloodGroup: 'O+'
        },
        contact: {
          mobile: '01734567890',
          email: 'karim@boguracoaching.com'
        },
        address: {
          present: 'Nawab Bari, Bogura',
          permanent: 'Nawab Bari, Bogura'
        },
        salaryInfo: {
          basicSalary: 25000,
          allowances: { transport: 2000, medical: 1000 }
        },
        status: 'ACTIVE'
      }
    }),
    prisma.teacher.create({
      data: {
        staffId: 'TCH004',
        sessionId: session.id,
        designation: 'Junior Teacher',
        subjects: ['ICT', 'General Science'],
        qualification: 'BSc in Computer Science',
        experience: '5 years',
        personal: {
          nameBn: 'নাসির উদ্দিন',
          nameEn: 'Nasir Uddin',
          dob: '1990-03-18',
          gender: 'MALE',
          bloodGroup: 'AB+'
        },
        contact: {
          mobile: '01745678901',
          email: 'nasir@boguracoaching.com'
        },
        address: {
          present: 'Kalitola, Bogura',
          permanent: 'Kalitola, Bogura'
        },
        salaryInfo: {
          basicSalary: 22000,
          allowances: { transport: 1500, medical: 1000 }
        },
        status: 'ACTIVE'
      }
    })
  ])

  // Create Students
  const boguraAreas = [
    'Satmatha', 'Thanthania', 'Nawab Bari', 'Kalitola', 'Rangpur Road',
    'Khanjanpur', 'Joypurhat Road', 'Mahasthangarh', 'Shibganj', 'Sonatola'
  ]

  const students = []
  let studentCounter = 1

  for (const cls of classes) {
    const classBatches = batches.filter(b => b.classId === cls.id)
    const classSections = sections.filter(s => s.classId === cls.id)
    
    for (let i = 0; i < 25; i++) {
      const batchIndex = i % classBatches.length
      const sectionIndex = i % classSections.length
      const areaIndex = i % boguraAreas.length
      
      const student = await prisma.student.create({
        data: {
          studentId: `STU${String(studentCounter).padStart(3, '0')}`,
          sessionId: session.id,
          classId: cls.id,
          batchId: classBatches[batchIndex].id,
          sectionId: classSections[sectionIndex].id,
          roll: String(i + 1),
          personal: {
            nameBn: `ছাত্র ${studentCounter}`,
            nameEn: `Student ${studentCounter}`,
            dob: `200${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
            bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)]
          },
          guardian: {
            fatherName: `Father of Student ${studentCounter}`,
            motherName: `Mother of Student ${studentCounter}`,
            fatherOccupation: ['Business', 'Service', 'Agriculture', 'Teaching'][Math.floor(Math.random() * 4)],
            motherOccupation: 'Housewife',
            contact: {
              smsNo: `0171${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
              altNo: `0181${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`
            }
          },
          address: {
            present: `${boguraAreas[areaIndex]}, Bogura`,
            permanent: `${boguraAreas[areaIndex]}, Bogura`
          },
          status: 'ACTIVE',
          continuityTick: Math.random() > 0.2
        }
      })
      students.push(student)
      studentCounter++
    }
  }

  // Create Fee Masters
  const feeMasters = await Promise.all([
    prisma.feeMaster.create({
      data: {
        sessionId: session.id,
        name: 'Admission Fee',
        amount: 2000,
        type: 'ADMISSION',
        dueDate: new Date('2025-01-31')
      }
    }),
    prisma.feeMaster.create({
      data: {
        sessionId: session.id,
        name: 'Monthly Tuition Fee',
        amount: 1500,
        type: 'MONTHLY',
        dueDate: new Date('2025-02-05')
      }
    }),
    prisma.feeMaster.create({
      data: {
        sessionId: session.id,
        name: 'Exam Fee',
        amount: 500,
        type: 'EXAM',
        dueDate: new Date('2025-03-15')
      }
    })
  ])

  // Create some collections
  for (let i = 0; i < 50; i++) {
    const randomStudent = students[Math.floor(Math.random() * students.length)]
    const randomFeeMaster = feeMasters[Math.floor(Math.random() * feeMasters.length)]
    const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)]
    
    await prisma.collection.create({
      data: {
        studentId: randomStudent.id,
        sessionId: session.id,
        feeMasterId: randomFeeMaster.id,
        amount: randomFeeMaster.amount,
        method: ['CASH', 'MOBILE_BANKING', 'BANK_TRANSFER'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.3 ? 'APPROVED' : 'PENDING',
        collectedBy: randomTeacher.id,
        collectedAt: new Date(),
        receiptNo: `RCP-${Date.now()}-${i}`
      }
    })
  }

  console.log('✅ Seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 1 Session (2025)`)
  console.log(`   - ${classes.length} Classes`)
  console.log(`   - ${batches.length} Batches`)
  console.log(`   - ${sections.length} Sections`)
  console.log(`   - ${teachers.length} Teachers`)
  console.log(`   - ${students.length} Students`)
  console.log(`   - ${feeMasters.length} Fee Masters`)
  console.log(`   - 50 Fee Collections`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })