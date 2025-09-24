"use client"

import { useState, useTransition, useEffect, useCallback, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    IconUser,
    IconPhone,
    IconCalendar,
    IconMapPin,
    IconEdit,
    IconCalendarEvent,
    IconAlertCircle,
    IconCheck,
} from "@tabler/icons-react"
import { updateStudentAction } from "../actions"
import { toast } from "sonner"
import type { StudentTableData } from "@/types/student"
import { editStudentSchema, type EditStudentFormData } from "@/lib/zod/student"
import SubmitButton from "@/components/submit-button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditStudentDialogProps {
    student: StudentTableData | null
    open: boolean
    onOpenChange: (open: boolean) => void
    sessions: Array<{ id: string; year: string }>
    classes: Array<{ id: string; name: string }>
    batches: Array<{ id: string; name: string }>
    sections: Array<{ id: string; name: string }>
}

export function EditStudentDialog({
    student,
    open,
    onOpenChange,
    sessions,
    classes,
    batches,
    sections,
}: EditStudentDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [currentStep, setCurrentStep] = useState(1)
    const [formErrors, setFormErrors] = useState<string[]>([])

    const form = useForm<EditStudentFormData>({
        resolver: zodResolver(editStudentSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            nameEn: "",
            nameBn: "",
            fatherNameEn: "",
            fatherNameBn: "",
            motherNameEn: "",
            motherNameBn: "",
            dateOfBirth: "",
            gender: "MALE",
            bloodGroup: "",
            religion: "",
            phone: "",
            email: "",
            address: "",
            emergencyContact: "",
            sessionId: "",
            classId: "",
            batchId: "",
            sectionId: "",
            rollNumber: "",
            registrationNumber: "",
            previousSchool: "",
            guardianOccupation: "",
            monthlyIncome: "",
            notes: "",
            status: "ACTIVE",
        },
    })

    const defaultValues = useMemo(() => {
        if (!student) return {}

        const personal = student.personal as any
        const guardian = student.guardian as any
        const address = student.address as any
        const contact = guardian?.contact

        return {
            nameEn: personal?.nameEn || "",
            nameBn: personal?.nameBn || "",
            fatherNameEn: guardian?.fatherName || "",
            fatherNameBn: guardian?.fatherNameBn || "",
            motherNameEn: guardian?.motherName || "",
            motherNameBn: guardian?.motherNameBn || "",
            dateOfBirth: personal?.dob ? new Date(personal.dob).toISOString().split("T")[0] : "",
            gender: personal?.gender || "MALE",
            bloodGroup: personal?.bloodGroup || "",
            religion: personal?.religion || "",
            phone: contact?.smsNo || "",
            email: contact?.email || "",
            address: address?.present || "",
            emergencyContact: contact?.altNo || "",
            sessionId: student.sessionId || "",
            classId: student.classId || "",
            batchId: student.batchId || "",
            sectionId: student.sectionId || "",
            rollNumber: student.roll || "",
            registrationNumber: student.studentId || "",
            previousSchool: guardian?.previousSchool || "",
            guardianOccupation: guardian?.occupation || "",
            monthlyIncome: guardian?.monthlyIncome ? guardian.monthlyIncome.toString() : "",
            notes: "",
            status: student.status || "ACTIVE",
        }
    }, [student])

    useEffect(() => {
        if (student && Object.keys(defaultValues).length > 0) {
            form.reset(defaultValues)
            form.clearErrors()
            setFormErrors([])
        }
    }, [student, form, defaultValues])

    const onSubmit = useCallback(
        async (values: EditStudentFormData) => {
            if (!student) return

            // Clear previous errors
            setFormErrors([])

            startTransition(async () => {
                try {
                    const result = await updateStudentAction(student.id, {
                        studentId: values.registrationNumber || "",
                        sessionId: values.sessionId,
                        classId: values.classId,
                        batchId: values.batchId || "",
                        sectionId: values.sectionId || "",
                        roll: values.rollNumber || "",
                        personal: {
                            nameEn: values.nameEn,
                            nameBn: values.nameBn || "",
                            dob: values.dateOfBirth || "",
                            gender: values.gender,
                            bloodGroup: values.bloodGroup || "",
                        },
                        guardian: {
                            fatherName: values.fatherNameEn,
                            motherName: values.motherNameEn || "",
                            fatherOccupation: values.guardianOccupation || "",
                            contact: {
                                smsNo: values.phone || "",
                                altNo: values.emergencyContact || "",
                                email: values.email || "",
                            },
                        },
                        address: {
                            present: values.address || "",
                        },
                        status: values.status as any,
                        continuityTick: false,
                    })

                    if (result.success) {
                        toast.success("Student updated successfully!")
                        onOpenChange(false)
                        setCurrentStep(1)
                        setFormErrors([])
                    } else {
                        const errorMessage = result.error || "Failed to update student"
                        setFormErrors([errorMessage])
                        toast.error(errorMessage)
                    }
                } catch (error) {
                    const errorMessage = "An unexpected error occurred"
                    setFormErrors([errorMessage])
                    toast.error(errorMessage)
                }
            })
        },
        [student, onOpenChange],
    )

    const nextStep = useCallback(async () => {
        const fieldsToValidate = getStepFields(currentStep)
        const isValid = await form.trigger(fieldsToValidate)

        if (isValid && currentStep < 4) {
            setCurrentStep(currentStep + 1)
            setFormErrors([]) // Clear errors when moving to next step
        } else if (!isValid) {
            // Show validation errors for current step
            const errors: string[] = []
            fieldsToValidate.forEach((field) => {
                const error = form.formState.errors[field]
                if (error) {
                    errors.push(`${field}: ${error.message}`)
                }
            })
            setFormErrors(errors)
        }
    }, [currentStep, form])

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
            setFormErrors([]) // Clear errors when going back
        }
    }, [currentStep])

    const getStepFields = useCallback((step: number): (keyof EditStudentFormData)[] => {
        switch (step) {
            case 1:
                return ["nameEn", "fatherNameEn", "gender"]
            case 2:
                return ["phone", "email"]
            case 3:
                return ["sessionId", "classId"]
            case 4:
                return []
            default:
                return []
        }
    }, [])

    const isStepValid = useCallback(
        (step: number) => {
            const fieldsToCheck = getStepFields(step)
            const formState = form.formState

            if (step === 4) return true

            return fieldsToCheck.every((field) => {
                const fieldError = formState.errors[field]
                const fieldValue = form.getValues(field)

                // For required fields, check if they have values
                if (
                    field === "nameEn" ||
                    field === "fatherNameEn" ||
                    field === "gender" ||
                    field === "sessionId" ||
                    field === "classId"
                ) {
                    return !fieldError && fieldValue && fieldValue.trim() !== ""
                }

                // For step 2, either phone or email should be provided
                if (step === 2) {
                    const phone = form.getValues("phone")
                    const email = form.getValues("email")
                    return !fieldError && (phone || email)
                }

                return !fieldError
            })
        },
        [form, getStepFields],
    )

    const renderStepContent = useMemo(() => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        {formErrors.length > 0 && (
                            <Alert variant="destructive">
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Please fix the following errors:
                                    <ul className="mt-2 list-disc list-inside">
                                        {formErrors.map((error, index) => (
                                            <li key={index} className="text-sm">
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nameEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1">
                                            Name (English)
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter student name"
                                                {...field}
                                                autoFocus
                                                className={cn(form.formState.errors.nameEn && "border-red-500 focus-visible:ring-red-500")}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nameBn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name (Bangla)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="শিক্ষার্থীর নাম" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fatherNameEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1">
                                            Father's Name (English)
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter father's name"
                                                {...field}
                                                className={cn(
                                                    form.formState.errors.fatherNameEn && "border-red-500 focus-visible:ring-red-500",
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fatherNameBn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Father's Name (Bangla)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="পিতার নাম" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="motherNameEn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mother's Name (English)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter mother's name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="motherNameBn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mother's Name (Bangla)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="মাতার নাম" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date of Birth</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                    >
                                                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                        <IconCalendarEvent className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align="start">
                                                <Calendar
                                                    mode="single"
                                                    className="w-full"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1">
                                            Gender
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                    className={cn(form.formState.errors.gender && "border-red-500 focus-visible:ring-red-500")}
                                                >
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MALE">Male</SelectItem>
                                                <SelectItem value="FEMALE">Female</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bloodGroup"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Blood Group</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select blood group" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="A+">A+</SelectItem>
                                                <SelectItem value="A-">A-</SelectItem>
                                                <SelectItem value="B+">B+</SelectItem>
                                                <SelectItem value="B-">B-</SelectItem>
                                                <SelectItem value="AB+">AB+</SelectItem>
                                                <SelectItem value="AB-">AB-</SelectItem>
                                                <SelectItem value="O+">O+</SelectItem>
                                                <SelectItem value="O-">O-</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="religion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Religion</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select religion" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ISLAM">Islam</SelectItem>
                                            <SelectItem value="HINDUISM">Hinduism</SelectItem>
                                            <SelectItem value="CHRISTIANITY">Christianity</SelectItem>
                                            <SelectItem value="BUDDHISM">Buddhism</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        {formErrors.length > 0 && (
                            <Alert variant="destructive">
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Please fix the following errors:
                                    <ul className="mt-2 list-disc list-inside">
                                        {formErrors.map((error, index) => (
                                            <li key={index} className="text-sm">
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Alert>
                            <IconAlertCircle className="h-4 w-4" />
                            <AlertDescription>Either phone number or email address is required.</AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter phone number (11 digits)"
                                                maxLength={11}
                                                {...field}
                                                className={cn(form.formState.errors.phone && "border-red-500 focus-visible:ring-red-500")}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter email address"
                                                {...field}
                                                className={cn(form.formState.errors.email && "border-red-500 focus-visible:ring-red-500")}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter full address" rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="emergencyContact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emergency Contact</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter emergency contact number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        {formErrors.length > 0 && (
                            <Alert variant="destructive">
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Please fix the following errors:
                                    <ul className="mt-2 list-disc list-inside">
                                        {formErrors.map((error, index) => (
                                            <li key={index} className="text-sm">
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sessionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1">
                                            Session
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                    className={cn(form.formState.errors.sessionId && "border-red-500 focus-visible:ring-red-500")}
                                                >
                                                    <SelectValue placeholder="Select session" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sessions.map((session) => (
                                                    <SelectItem key={session.id} value={session.id}>
                                                        {session.year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="classId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1">
                                            Class
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger
                                                    className={cn(form.formState.errors.classId && "border-red-500 focus-visible:ring-red-500")}
                                                >
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {classes.map((cls) => (
                                                    <SelectItem key={cls.id} value={cls.id}>
                                                        {cls.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-red-600" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="batchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Batch</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select batch" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {batches.map((batch) => (
                                                    <SelectItem key={batch.id} value={batch.id}>
                                                        {batch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sectionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select section" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {sections.map((section) => (
                                                    <SelectItem key={section.id} value={section.id}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="rollNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Roll Number</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter roll number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="registrationNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Registration Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter registration number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            <SelectItem value="GRADUATED">Graduated</SelectItem>
                                            <SelectItem value="DROPPED">Dropped</SelectItem>
                                            <SelectItem value="DISABLED">Disabled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="previousSchool"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Previous School</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter previous school name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="guardianOccupation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guardian's Occupation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter guardian's occupation" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="monthlyIncome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monthly Income</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter monthly income" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter any additional notes" rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )

            default:
                return null
        }
    }, [currentStep, formErrors, form.formState.errors, form.getValues, sessions, classes, batches, sections])

    const steps = useMemo(
        () => [
            { number: 1, title: "Personal Info", icon: IconUser },
            { number: 2, title: "Contact Info", icon: IconPhone },
            { number: 3, title: "Academic Info", icon: IconCalendar },
            { number: 4, title: "Additional Info", icon: IconMapPin },
        ],
        [],
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] md:max-w-[50vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconEdit className="h-5 w-5" />
                        Edit Student Information
                    </DialogTitle>
                    <DialogDescription>Update student information. Fields marked with * are required.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${currentStep === step.number
                                                ? "border-primary bg-primary text-primary-foreground shadow-lg"
                                                : currentStep > step.number
                                                    ? "border-green-500 bg-green-500 text-white"
                                                    : isStepValid(step.number)
                                                        ? "border-blue-300 bg-blue-50 text-blue-600"
                                                        : "border-gray-300 bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        {currentStep > step.number ? <IconCheck className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                                    </div>
                                    <div className="ml-2 block">
                                        <div
                                            className={`text-xs sm:text-sm font-medium transition-colors duration-200 ${currentStep >= step.number ? "text-gray-900" : "text-gray-500"
                                                }`}
                                        >
                                            {step.title}
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`hidden sm:block w-8 lg:w-12 h-0.5 mx-2 lg:mx-4 transition-colors duration-200 ${currentStep > step.number ? "bg-green-500" : "bg-gray-300"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Step Content */}
                        <Card className="border-2">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    {(() => {
                                        const IconComponent = steps[currentStep - 1].icon
                                        return <IconComponent className="h-5 w-5" />
                                    })()}
                                    {steps[currentStep - 1].title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>{renderStepContent}</CardContent>
                        </Card>

                        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 pt-4">
                            <div className="flex gap-2 order-2 sm:order-1">
                                {currentStep > 1 && (
                                    <Button type="button" variant="outline" onClick={prevStep} disabled={isPending}>
                                        Previous
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
                                {currentStep < 4 ? (
                                    <Button type="button" onClick={nextStep} disabled={isPending} className="w-full sm:w-auto">
                                        Next
                                    </Button>
                                ) : (
                                    <SubmitButton type="submit" loading={isPending} className="w-full sm:w-auto">
                                        Update Student
                                    </SubmitButton>
                                )}
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
