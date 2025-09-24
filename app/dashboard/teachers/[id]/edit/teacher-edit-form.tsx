'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IconArrowLeft, IconX, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { updateTeacherAction, createTeacherAction } from '@/actions';
import { teacherEditSchema, teacherCreateSchema, type TeacherEditFormData, type TeacherCreateFormData } from '@/lib/zod/teacher';
import SubmitButton from '@/components/submit-button';

interface TeacherEditFormProps {
  teacher?: any;
  isEdit?: boolean;
  onSuccess?: () => void;
}

export function TeacherEditForm({ teacher, isEdit = true, onSuccess }: TeacherEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const personal = teacher?.personal as any;
  const contact = teacher?.contact as any;
  const address = teacher?.address as any;
  const salaryInfo = teacher?.salaryInfo as any;

  const form = useForm<TeacherEditFormData | TeacherCreateFormData>({
    resolver: zodResolver(isEdit ? teacherEditSchema : teacherCreateSchema),
    defaultValues: {
      teacherId: teacher?.staffId || '',
      nameEn: personal?.nameEn || '',
      nameBn: personal?.nameBn || '',
      dob: personal?.dob || '',
      gender: personal?.gender || undefined,
      bloodGroup: personal?.bloodGroup || '',
      mobile: contact?.mobile || '',
      email: contact?.email || '',
      presentAddress: address?.present || '',
      permanentAddress: address?.permanent || '',
      designation: teacher?.designation || '',
      qualification: teacher?.qualification || '',
      experience: teacher?.experience || '',
      subjects: teacher?.subjects || [],
      basicSalary: salaryInfo?.basic || 0,
      allowances: salaryInfo?.allowances || 0,
      status: teacher?.status || 'ACTIVE',
    },
  });

  const addSubject = () => {
    const currentSubjects = form.getValues('subjects');
    if (newSubject.trim() && !currentSubjects.includes(newSubject.trim())) {
      form.setValue('subjects', [...currentSubjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    const currentSubjects = form.getValues('subjects');
    form.setValue('subjects', currentSubjects.filter(s => s !== subject));
  };

  const onSubmit = async (data: TeacherEditFormData | TeacherCreateFormData) => {
    setIsLoading(true);
    try {
      const formData = {
        teacherId: data.teacherId,
        personal: {
          nameEn: data.nameEn,
          nameBn: data.nameBn,
          dob: data.dob,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
        },
        contact: {
          smsNo: data.mobile,
          email: data.email,
          address: {
            present: data.presentAddress,
            permanent: data.permanentAddress,
          }
        },
        designation: data.designation,
        subjects: data.subjects,
        qualification: data.qualification,
        experience: data.experience,
        salaryInfo: {
          basic: data.basicSalary || 0,
          allowances: data.allowances || 0,
        },
        status: data.status,
      };

      const result = isEdit
        ? await updateTeacherAction(teacher.id, formData)
        : await createTeacherAction(formData);

      if (result.success) {
        toast.success(`Teacher ${isEdit ? 'updated' : 'created'} successfully`);
        if (isEdit) {
          router.push(`/dashboard/teachers/${teacher.id}`);
        } else {
          form.reset();
          router.push("/dashboard/teachers")
          onSuccess?.();
        }
      } else {
        toast.error(result.error || `Failed to ${isEdit ? 'update' : 'create'} teacher`);
      }
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} teacher`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {isEdit && (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/teachers/${teacher.id}`}>
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Link>
        </Button>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameBn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Bengali)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
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
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="presentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Present Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permanentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permanent Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subjects</FormLabel>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          placeholder="Add subject"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                        />
                        <Button type="button" onClick={addSubject} size="sm">
                          <IconPlus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {field.value.map((subject, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {subject}
                            <IconX className="h-3 w-3 cursor-pointer" onClick={() => removeSubject(subject)} />
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Salary Information */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="basicSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Basic Salary</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allowances"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowances</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          <SelectItem value="DISABLED">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => isEdit ? router.back() : onSuccess?.()}>
              Cancel
            </Button>
            <SubmitButton type="submit" loading={isLoading}>
              {isLoading ? `${isEdit ? 'Updating' : 'Creating'}...` : `${isEdit ? 'Update' : 'Create'} Teacher`}
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}