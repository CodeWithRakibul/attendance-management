import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with Bogura coaching center data...')

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
    const batch1 = await prisma.batch.create({
      data: {
        name: 'Morning Batch',
        classId: cls.id,
        sessionId: session.id,
        timeSlot: '8:00 AM - 12:00 PM'
      }
    })
    const batch2 = await prisma.batch.create({
      data: {
        name: 'Evening Batch',
        classId: cls.id,
        sessionId: session.id,
        timeSlot: '2:00 PM - 6:00 PM'
      }
    })
    batches.push(batch1, batch2)
  }

  // Create Sections
  const sections = []
  for (const cls of classes) {
    const sectionA = await prisma.section.create({
      data: { name: 'A', classId: cls.id, sessionId: session.id }
    })
    const sectionB = await prisma.section.create({
      data: { name: 'B', classId: cls.id, sessionId: session.id }
    })
    sections.push(sectionA, sectionB)
  }

  // Create Teachers
  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        staffId: 'T001',
        sessionId: session.id,
        designation: 'Head Teacher',
        subjects: ['Mathematics', 'Physics'],
        qualification: 'MSc in Mathematics',
        experience: '15 years',
        personal: {
          nameBn: 'মোহাম্মদ রহিম উদ্দিন',
          nameEn: 'Mohammad Rahim Uddin',
          dob: '1980-05-15',
          gender: 'Male',
          bloodGroup: 'B+'
        },
        contact: {
          mobile: '01712345678',
          email: 'rahim@boguracoaching.com',
          facebook: 'rahim.uddin'
        },
        address: {
          present: 'Satmatha, Bogura Sadar, Bogura',
          permanent: 'Satmatha, Bogura Sadar, Bogura'
        },
        salaryInfo: {
          basicSalary: 35000,
          allowances: { transport: 3000, medical: 2000 },
          advanceTaken: 0
        }
      }
    }),
    prisma.teacher.create({
      data: {
        staffId: 'T002',
        sessionId: session.id,
        designation: 'Senior Teacher',
        subjects: ['English', 'Bangla'],
        qualification: 'MA in English',
        experience: '12 years',
        personal: {
          nameBn: 'ফাতেমা খাতুন',
          nameEn: 'Fatema Khatun',
          dob: '1985-08-22',
          gender: 'Female',
          bloodGroup: 'A+'
        },
        contact: {
          mobile: '01812345679',
          email: 'fatema@boguracoaching.com',
          facebook: 'fatema.khatun'
        },
        address: {
          present: 'Thanthania, Bogura Sadar, Bogura',
          permanent: 'Thanthania, Bogura Sadar, Bogura'
        },
        salaryInfo: {
          basicSalary: 28000,
          allowances: { transport: 2500, medical: 1500 },
          advanceTaken: 5000
        }
      }
    }),
    prisma.teacher.create({
      data: {
        staffId: 'T003',
        sessionId: session.id,
        designation: 'Assistant Teacher',
        subjects: ['Chemistry', 'Biology'],
        qualification: 'BSc in Chemistry',
        experience: '8 years',
        personal: {
          nameBn: 'আব্দুল করিম',
          nameEn: 'Abdul Karim',
          dob: '1988-12-10',
          gender: 'Male',
          bloodGroup: 'O+'
        },
        contact: {
          mobile: '01912345680',
          email: 'karim@boguracoaching.com',
          facebook: 'abdul.karim'
        },
        address: {
          present: 'Kalitola, Bogura Sadar, Bogura',
          permanent: 'Kalitola, Bogura Sadar, Bogura'
        },
        salaryInfo: {
          basicSalary: 22000,
          allowances: { transport: 2000, medical: 1000 },
          advanceTaken: 0
        }
      }
    }),
    prisma.teacher.create({
      data: {
        staffId: 'T004',
        sessionId: session.id,
        designation: 'Junior Teacher',
        subjects: ['ICT', 'General Science'],
        qualification: 'BSc in Computer Science',
        experience: '5 years',
        personal: {
          nameBn: 'নাসির উদ্দিন',
          nameEn: 'Nasir Uddin',
          dob: '1992-03-18',
          gender: 'Male',
          bloodGroup: 'AB+'
        },
        contact: {
          mobile: '01712345681',
          email: 'nasir@boguracoaching.com',
          facebook: 'nasir.uddin'
        },
        address: {
          present: 'Chelopara, Bogura Sadar, Bogura',
          permanent: 'Chelopara, Bogura Sadar, Bogura'
        },
        salaryInfo: {
          basicSalary: 18000,
          allowances: { transport: 1500, medical: 800 },
          advanceTaken: 2000
        }
      }
    })
  ])

  // Create Students
  const boguraAreas = [
    'Satmatha', 'Thanthania', 'Kalitola', 'Chelopara', 'Rangpur Road',
    'Khanjanpur', 'Nawab Bari Road', 'Tin Matha', 'Joypurhat Road',
    'Mahasthangarh', 'Shibganj', 'Sonatola', 'Gabtali', 'Sherpur'
  ]

  const students = []
  let studentCounter = 1

  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i]
    const classBatches = batches.filter(b => b.classId === cls.id)
    const classSections = sections.filter(s => s.classId === cls.id)

    for (let j = 0; j < 25; j++) {
      const area = boguraAreas[Math.floor(Math.random() * boguraAreas.length)]
      const batch = classBatches[Math.floor(Math.random() * classBatches.length)]
      const section = classSections[Math.floor(Math.random() * classSections.length)]
      
      const student = await prisma.student.create({
        data: {
          studentId: `STU${String(studentCounter).padStart(4, '0')}`,
          sessionId: session.id,
          classId: cls.id,
          batchId: batch.id,
          sectionId: section.id,
          roll: String(j + 1).padStart(2, '0'),
          personal: {
            nameBn: getBanglaName(j),
            nameEn: getEnglishName(j),
            dob: getRandomDate(),
            gender: j % 3 === 0 ? 'Female' : 'Male',
            bloodGroup: getRandomBloodGroup(),
            photoUrl: null
          },
          guardian: {
            fatherName: getFatherName(j),
            motherName: getMotherName(j),
            occupations: {
              father: getRandomOccupation(),
              mother: 'Housewife'
            },
            contact: {
              smsNo: `0171${String(Math.floor(Math.random() * 1000000)).padStart(7, '0')}`,
              altNo: `0181${String(Math.floor(Math.random() * 1000000)).padStart(7, '0')}`,
              email: `guardian${studentCounter}@gmail.com`
            }
          },
          address: {
            present: `${area}, Bogura Sadar, Bogura`,
            permanent: `${area}, Bogura Sadar, Bogura`
          }
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
        type: 'ADMISSION'
      }
    }),
    prisma.feeMaster.create({
      data: {
        sessionId: session.id,
        name: 'Monthly Tuition',
        amount: 1500,
        type: 'MONTHLY'
      }
    }),
    prisma.feeMaster.create({
      data: {
        sessionId: session.id,
        name: 'Exam Fee',
        amount: 500,
        type: 'EXAM'
      }
    })
  ])

  // Create some Collections
  for (let i = 0; i < 50; i++) {
    const student = students[Math.floor(Math.random() * students.length)]
    const feeMaster = feeMasters[Math.floor(Math.random() * feeMasters.length)]
    const teacher = teachers[Math.floor(Math.random() * teachers.length)]
    
    await prisma.collection.create({
      data: {
        studentId: student.id,
        sessionId: session.id,
        feeMasterId: feeMaster.id,
        amount: feeMaster.amount,
        method: Math.random() > 0.5 ? 'CASH' : 'MOBILE_BANKING',
        status: 'APPROVED',
        collectedBy: teacher.id,
        receiptNo: `RCP${String(i + 1).padStart(4, '0')}`,
        collectedAt: new Date()
      }
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - 1 Session (2025)`)
  console.log(`   - ${classes.length} Classes`)
  console.log(`   - ${batches.length} Batches`)
  console.log(`   - ${sections.length} Sections`)
  console.log(`   - ${teachers.length} Teachers`)
  console.log(`   - ${students.length} Students`)
  console.log(`   - ${feeMasters.length} Fee Masters`)
  console.log(`   - 50 Collections`)
}

// Helper functions
function getBanglaName(index: number): string {
  const names = [
    'মোহাম্মদ রাকিব', 'ফাতেমা খাতুন', 'আব্দুল করিম', 'আয়েশা সিদ্দিকা',
    'মোস্তাফিজুর রহমান', 'সালমা বেগম', 'নাসির উদ্দিন', 'রোকেয়া খাতুন',
    'জাহিদুল ইসলাম', 'নার্গিস আক্তার', 'শাহিদুল ইসলাম', 'রাশিদা বেগম',
    'আবুল কালাম', 'সুমাইয়া খাতুন', 'মনিরুল ইসলাম', 'তাসলিমা খাতুন',
    'রফিকুল ইসলাম', 'শাহনাজ পারভীন', 'কামরুল হাসান', 'নাজমা খাতুন',
    'আনোয়ার হোসেন', 'রেহানা খাতুন', 'মাহবুবুর রহমান', 'সাবিনা ইয়াসমিন',
    'হাবিবুর রহমান', 'রুমানা আক্তার'
  ]
  return names[index % names.length]
}

function getEnglishName(index: number): string {
  const names = [
    'Mohammad Rakib', 'Fatema Khatun', 'Abdul Karim', 'Ayesha Siddika',
    'Mostafizur Rahman', 'Salma Begum', 'Nasir Uddin', 'Rokeya Khatun',
    'Zahidul Islam', 'Nargis Akter', 'Shahidul Islam', 'Rashida Begum',
    'Abul Kalam', 'Sumaiya Khatun', 'Monirul Islam', 'Taslima Khatun',
    'Rafiqul Islam', 'Shahnaz Parveen', 'Kamrul Hasan', 'Nazma Khatun',
    'Anowar Hosen', 'Rehana Khatun', 'Mahbubur Rahman', 'Sabina Yasmin',
    'Habibur Rahman', 'Rumana Akter'
  ]
  return names[index % names.length]
}

function getFatherName(index: number): string {
  const names = [
    'আব্দুল হামিদ', 'মোহাম্মদ আলী', 'নুরুল ইসলাম', 'আব্দুর রহমান',
    'মোস্তফা কামাল', 'শাহ আলম', 'আনোয়ার হোসেন', 'রফিকুল ইসলাম'
  ]
  return names[index % names.length]
}

function getMotherName(index: number): string {
  const names = [
    'রোকেয়া বেগম', 'ফাতেমা খাতুন', 'সালমা আক্তার', 'নার্গিস বেগম',
    'রাশিদা খাতুন', 'সুমাইয়া বেগম', 'তাসলিমা আক্তার', 'শাহনাজ বেগম'
  ]
  return names[index % names.length]
}

function getRandomOccupation(): string {
  const occupations = [
    'Farmer', 'Business', 'Teacher', 'Government Service',
    'Private Job', 'Shop Owner', 'Driver', 'Mechanic'
  ]
  return occupations[Math.floor(Math.random() * occupations.length)]
}

function getRandomBloodGroup(): string {
  const groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  return groups[Math.floor(Math.random() * groups.length)]
}

function getRandomDate(): string {
  const start = new Date(2005, 0, 1)
  const end = new Date(2012, 11, 31)
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })