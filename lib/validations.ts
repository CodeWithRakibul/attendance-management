import { z } from 'zod'

export const studentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  sessionId: z.string().min(1, 'Session is required'),
  classId: z.string().min(1, 'Class is required'),
  batchId: z.string().min(1, 'Batch is required'),
  sectionId: z.string().min(1, 'Section is required'),
  roll: z.string().min(1, 'Roll number is required'),
  personal: z.object({
    nameBn: z.string().min(1, 'Bangla name is required'),
    nameEn: z.string().min(1, 'English name is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    bloodGroup: z.string().optional(),
    photoUrl: z.string().optional()
  }),
  guardian: z.object({
    fatherName: z.string().min(1, "Father's name is required"),
    motherName: z.string().min(1, "Mother's name is required"),
    fatherOccupation: z.string().optional(),
    motherOccupation: z.string().optional(),
    annualIncome: z.coerce.number().optional(),
    contact: z.object({
      smsNo: z.string().min(1, 'SMS number is required'),
      altNo: z.string().optional(),
      email: z.string().email('Invalid email').optional().or(z.literal(''))
    })
  }),
  address: z.object({
    present: z.string().min(1, 'Present address is required'),
    permanent: z.string().optional()
  }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISABLED']).default('ACTIVE'),
  continuityTick: z.boolean().default(false)
})

export type StudentFormData = z.infer<typeof studentSchema>

export const feeMasterSchema = z.object({
  sessionId: z.string().min(1, 'Session is required'),
  name: z.string().min(1, 'Fee name is required'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  type: z.enum(['ADMISSION', 'MONTHLY', 'EXAM', 'TRANSPORT', 'LIBRARY', 'LABORATORY', 'OTHER']),
  dueDate: z.string().optional(),
})

export type FeeMasterFormData = z.infer<typeof feeMasterSchema>

export const feeCollectionSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  sessionId: z.string().min(1, 'Session is required'),
  feeMasterId: z.string().min(1, 'Fee type is required'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'MOBILE_BANKING', 'CARD']),
  receiptNo: z.string().optional(),
})

export type FeeCollectionFormData = z.infer<typeof feeCollectionSchema>