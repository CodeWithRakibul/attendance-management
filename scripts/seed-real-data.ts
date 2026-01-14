import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Real-tick Data...')

  // Loop through years
  const years = ['2024', '2025', '2026']

  for (const year of years) {
      console.log(`\n📅 Processing Session ${year}...`)
      
      // 1. Ensure Session exists
      let session = await prisma.session.findUnique({ where: { year } })
      if (!session) {
        session = await prisma.session.create({
          data: { year, status: year === '2026' ? 'ACTIVE' : 'CLOSED' } // Make latest active
        })
        console.log(`✅ Created Session ${year}`)
      } else {
        console.log(`ℹ️ Session ${year} already exists`)
      }

      // 2. Ensure Classes 1-10 exist for THIS session
      const classNames = [
        'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
      ]

      const classes = []
      for (const name of classNames) {
        let cls = await prisma.class.findFirst({
            where: { name, sessionId: session.id }
        })
        if (!cls) {
            cls = await prisma.class.create({
                data: { name, sessionId: session.id }
            })
            // console.log(`✅ Created ${name} for ${year}`)
        }
        classes.push(cls)
      }

      // 3. Ensure Batches & Sections exist for each class
      const batches = []
      const sections = []

      for (const cls of classes) {
        // Batch
        let batch = await prisma.batch.findFirst({
            where: { classId: cls.id, name: 'Morning Shift' }
        })
        if (!batch) {
            batch = await prisma.batch.create({
                data: {
                    name: 'Morning Shift',
                    classId: cls.id,
                    sessionId: session.id,
                    timeSlot: '8:00 AM - 12:00 PM'
                }
            })
        }
        batches.push(batch)

        // Section
        let section = await prisma.section.findFirst({
            where: { classId: cls.id, name: 'A' }
        })
        if (!section) {
            section = await prisma.section.create({
                data: { name: 'A', classId: cls.id, sessionId: session.id }
            })
        }
        sections.push(section)
      }

      // 4. Ensure Teachers exist (Teachers are usually cross-session, but for this schema they are linked to session? 
      // Checking schema: Teacher model has sessionId. So we need teachers per session or migrate them.
      // For seeding, let's add teachers to each session.)
      const teacherData = [
        { name: 'Rahim Uddin', subject: 'Mathematics' },
        { name: 'Fatema Khatun', subject: 'English' },
        { name: 'Abdul Karim', subject: 'Science' },
        { name: 'Nasir Uddin', subject: 'ICT' },
        { name: 'Salma Begum', subject: 'Bangla' }
      ]

      const teacherCount = await prisma.teacher.count({ where: { sessionId: session.id } })
      
      if (teacherCount < 5) {
         for (let i = 0; i < teacherData.length; i++) {
            const staffId = `TCH${year}${String(i + 1).padStart(3, '0')}` // Unique staff ID per session/year combo if needed, or re-use logic
            
            // Check if this teacher exists in this session
            const exists = await prisma.teacher.findFirst({ where: { sessionId: session.id, staffId } })
            if (exists) continue;

            await prisma.teacher.create({
                data: {
                    staffId,
                    sessionId: session.id,
                    designation: 'Teacher',
                    subjects: [teacherData[i].subject],
                    status: 'ACTIVE',
                    personal: {
                        nameBn: teacherData[i].name, 
                        nameEn: teacherData[i].name,
                        dob: '1985-01-01',
                        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
                        bloodGroup: 'B+'
                    },
                    contact: { mobile: `01700${i}00${i}00`, email: `teacher${year}${i}@example.com` },
                    address: { present: 'Dhaka', permanent: 'Dhaka' },
                    salaryInfo: { basicSalary: 20000 + (parseInt(year) - 2024) * 1000, allowances: {} } // Increment salary per year
                }
            })
         }
         console.log(`✅ Teachers added for ${year}`)
      }

      // 5. Ensure Students
      const maleNames = ['Rahim', 'Karim', 'Sujon', 'Monir', 'Hasan', 'Rakib', 'Siyam', 'Arif', 'Nayeem', 'Sakin']
      const femaleNames = ['Fatema', 'Ayesha', 'Salma', 'Sumaiya', 'Nusrat', 'Mahi', 'Sadia', 'Rima', 'Tanya', 'Lima']
      
      // Bangla names mapping (Simple mock)
      const bnNames = {
          'Rahim': 'রহিম', 'Karim': 'করিম', 'Sujon': 'সুজন', 'Monir': 'মনির',
          'Fatema': 'ফাতেমা', 'Ayesha': 'আয়েশা', 'Salma': 'সালমা'
      }

      let studentCounter = (await prisma.student.count()) + 1000

      for (const cls of classes) {
          const clsBatches = batches.filter(b => b.classId === cls.id)
          const clsSections = sections.filter(s => s.classId === cls.id)
          
          const currentStudentCount = await prisma.student.count({ where: { classId: cls.id } })
          const needed = 15 - currentStudentCount

          if (needed > 0) {
              // console.log(`Generating ${needed} students for ${cls.name} (${year})...`)
              for (let i = 0; i < needed; i++) {
                  const batch = clsBatches[0]
                  const section = clsSections[0]
                  const isMale = Math.random() > 0.5
                  
                  const firstNameEn = isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)]
                  const lastNameEn = isMale ? maleNames[Math.floor(Math.random() * maleNames.length)] : femaleNames[Math.floor(Math.random() * femaleNames.length)]
                  const nameEn = `${firstNameEn} ${lastNameEn}`
                  const nameBn = `${bnNames[firstNameEn as keyof typeof bnNames] || firstNameEn} ${bnNames[lastNameEn as keyof typeof bnNames] || lastNameEn}`

                  await prisma.student.create({
                      data: {
                          studentId: `STU${year}${studentCounter++}`,
                          sessionId: session.id,
                          classId: cls.id,
                          batchId: batch.id,
                          sectionId: section.id,
                          roll: String(currentStudentCount + i + 1),
                          status: 'ACTIVE',
                          personal: {
                              nameBn: nameBn,
                              nameEn: nameEn,
                              dob: '2010-01-01',
                              gender: isMale ? 'MALE' : 'FEMALE',
                              bloodGroup: 'A+'
                          },
                          guardian: {
                              fatherName: 'Father ' + nameEn,
                              motherName: 'Mother ' + nameEn,
                              contact: { smsNo: '01700000000', email: 'guard@email.com' }
                          },
                          address: { present: 'Dhaka', permanent: 'Dhaka' }
                      }
                  })
              }
          }
      }
      console.log(`✅ Students added for ${year}`)
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
