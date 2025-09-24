'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ArrowLeft, Save, User, Users, MapPin } from 'lucide-react'
import { createStudentAction, getCurrentSession, getClasses, getBatches, getSections } from '@/actions/student'
import { studentSchema, type StudentFormData } from '@/lib/validations'
import SubmitButton from '@/components/submit-button'

export default function StudentCreatePage() {
    const router = useRouter()
    const [classes, setClasses] = useState<any[]>([])
    const [batches, setBatches] = useState<any[]>([])
    const [sections, setSections] = useState<any[]>([])

    const form = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            studentId: '',
            sessionId: '',
            classId: '',
            batchId: '',
            sectionId: '',
            roll: '',
            personal: {
                nameBn: '',
                nameEn: '',
                dob: '',
                gender: 'MALE',
                bloodGroup: '',
                photoUrl: ''
            },
            guardian: {
                fatherName: '',
                motherName: '',
                fatherOccupation: '',
                motherOccupation: '',
                contact: {
                    smsNo: '',
                    altNo: '',
                    email: ''
                }
            },
            address: {
                present: '',
                permanent: ''
            },
            status: 'ACTIVE',
            continuityTick: false
        }
    })

    const watchedClassId = form.watch('classId')
    const watchedSessionId = form.watch('sessionId')

    useEffect(() => {
        loadInitialData()
    }, [])

    useEffect(() => {
        if (watchedClassId && watchedSessionId) {
            loadBatchesAndSections()
        }
    }, [watchedClassId, watchedSessionId])

    const loadInitialData = async () => {
        try {
            const currentSession = await getCurrentSession()
            if (currentSession) {
                form.setValue('sessionId', currentSession.id)

                const classesData = await getClasses(currentSession.id)
                setClasses(classesData)
            }
        } catch (error) {
            console.error('Failed to load initial data:', error)
        }
    }

    const loadBatchesAndSections = async () => {
        try {
            const [batchesData, sectionsData] = await Promise.all([
                getBatches(watchedClassId, watchedSessionId),
                getSections(watchedClassId, watchedSessionId)
            ])
            setBatches(batchesData)
            setSections(sectionsData)
        } catch (error) {
            console.error('Failed to load batches and sections:', error)
        }
    }

    const onSubmit = async (data: StudentFormData) => {
        try {
            const result = await createStudentAction(data)
            if (result.success) {
                router.push('/dashboard/students')
            } else {
                alert(result.error || 'Failed to create student')
            }
        } catch (error) {
            alert('Failed to create student')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto p-6 max-w-5xl">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Student</h1>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Academic Information */}
                        <Card className="shadow-sm border-0 bg-white !pt-0">
                            <CardHeader className="bg-gradient-to-r from-blue-50 !py-3 to-indigo-50 border-b">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    Academic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="studentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Student ID *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="roll"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Roll Number *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="classId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Class *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="batchId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Batch *</FormLabel>
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
                                                <FormLabel>Section *</FormLabel>
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
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card className="shadow-sm border-0 bg-white !pt-0">
                            <CardHeader className="bg-gradient-to-r from-green-50 !py-3 to-emerald-50 border-b">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <User className="h-5 w-5 text-green-600" />
                                    </div>
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="personal.nameBn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name (Bangla) *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="personal.nameEn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name (English) *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="personal.dob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date of Birth *</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="personal.gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MALE">Male</SelectItem>
                                                        <SelectItem value="FEMALE">Female</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="personal.bloodGroup"
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
                            </CardContent>
                        </Card>

                        {/* Guardian Information */}
                        <Card className="shadow-sm border-0 !pt-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-purple-50 !py-3 to-violet-50 border-b">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Users className="h-5 w-5 text-purple-600" />
                                    </div>
                                    Guardian Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="guardian.fatherName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Father's Name *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardian.motherName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mother's Name *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardian.fatherOccupation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Father's Occupation</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardian.motherOccupation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mother's Occupation</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardian.contact.smsNo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>SMS Number *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardian.contact.altNo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Alternative Number</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="guardian.contact.email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Information */}
                        <Card className="shadow-sm border-0 !pt-0 bg-white">
                            <CardHeader className="bg-gradient-to-r from-orange-50 !py-3 to-amber-50 border-b">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <MapPin className="h-5 w-5 text-orange-600" />
                                    </div>
                                    Address Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="address.present"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Present Address *</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.permanent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Permanent Address</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Leave empty if same as present address" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Submit Actions */}
                        <Card className="shadow-sm border-0 bg-white">
                            <CardContent>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        <span className="text-red-500">*</span> Required fields
                                    </div>
                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={() => router.back()}>
                                            Cancel
                                        </Button>
                                        <SubmitButton type="submit" loading={form.formState.isSubmitting} className="min-w-[140px]">
                                            <Save className="size-4" />
                                            Create Student
                                        </SubmitButton>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    )
}