import { z } from "zod"

export const editStudentSchema = z
  .object({
    nameEn: z.string().min(2, "Name must be at least 2 characters"),
    nameBn: z.string().optional(),
    fatherNameEn: z.string().min(2, "Father's name must be at least 2 characters"),
    fatherNameBn: z.string().optional(),
    motherNameEn: z.string().optional(),
    motherNameBn: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      required_error: "Please select a gender",
    }),
    bloodGroup: z.string().optional(),
    religion: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val === "") return true
        return val.length === 11 && /^\d+$/.test(val)
      }, "Phone number must be exactly 11 digits"),
    email: z
      .string()
      .optional()
      .refine((val) => {
        if (!val || val === "") return true
        return z.string().email().safeParse(val).success
      }, "Please enter a valid email address"),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    sessionId: z.string().min(1, "Please select a session"),
    classId: z.string().min(1, "Please select a class"),
    batchId: z.string().optional(),
    sectionId: z.string().optional(),
    rollNumber: z.string().optional(),
    registrationNumber: z.string().optional(),
    previousSchool: z.string().optional(),
    guardianOccupation: z.string().optional(),
    monthlyIncome: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "DROPPED", "DISABLED"]).optional(),
  })
  // Now phone and email validation is handled individually with clearer error messages
  .refine(
    (data) => {
      return data.phone || data.email
    },
    {
      message: "Either phone number or email address is required",
      path: ["phone"], // Show error on phone field
    },
  )

export type EditStudentFormData = z.infer<typeof editStudentSchema>
