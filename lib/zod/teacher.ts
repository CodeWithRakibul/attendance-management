import { z } from "zod";

export const teacherEditSchema = z.object({
  teacherId: z.string().min(1, "Teacher ID is required"),
  nameEn: z.string().min(2, "Name must be at least 2 characters"),
  nameBn: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bloodGroup: z.string().optional(),
  mobile: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  designation: z.string().min(1, "Designation is required"),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  basicSalary: z.number().min(0, "Basic salary must be positive").optional(),
  allowances: z.number().min(0, "Allowances must be positive").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DISABLED"]),
});

export const teacherCreateSchema = z.object({
  teacherId: z.string().min(1, "Teacher ID is required"),
  nameEn: z.string().min(2, "Name must be at least 2 characters"),
  nameBn: z.string().optional(),
  dob: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bloodGroup: z.string().optional(),
  mobile: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  designation: z.string().min(1, "Designation is required"),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  basicSalary: z.number().min(0, "Basic salary must be positive").optional(),
  allowances: z.number().min(0, "Allowances must be positive").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DISABLED"]).default("ACTIVE"),
});

export type TeacherEditFormData = z.infer<typeof teacherEditSchema>;
export type TeacherCreateFormData = z.infer<typeof teacherCreateSchema>;