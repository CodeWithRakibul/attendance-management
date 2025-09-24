'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IconX, IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';
import { createTeacherAction } from '@/actions';
import { teacherCreateSchema, type TeacherCreateFormData } from '@/lib/zod/teacher';

interface TeacherAddDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function TeacherAddDialog({ children, onSuccess }: TeacherAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const form = useForm<TeacherCreateFormData>({
    resolver: zodResolver(teacherCreateSchema),
    defaultValues: {
      teacherId: '',
      nameEn: '',
      nameBn: '',
      dob: '',
      gender: undefined,
      bloodGroup: '',
      mobile: '',
      email: '',
      presentAddress: '',
      permanentAddress: '',
      designation: '',
      qualification: '',
      experience: '',
      subjects: [],
      basicSalary: 0,
      allowances: 0,
      status: 'ACTIVE',
    },
  });

  const addSubject = () => {
    const trimmedSubject = newSubject.trim();
    const currentSubjects = form.getValues('subjects');
    if (trimmedSubject && !currentSubjects.includes(trimmedSubject)) {
      form.setValue('subjects', [...currentSubjects, trimmedSubject]);
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    const currentSubjects = form.getValues('subjects');
    form.setValue('subjects', currentSubjects.filter(s => s !== subject));
  };

  const onSubmit = async (data: TeacherCreateFormData) => {
    setLoading(true);
    try {
      const createData = {
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

      const result = await createTeacherAction(createData);
      
      if (result.success) {
        toast.success('Teacher created successfully');
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.error || 'Failed to create teacher');
      }
    } catch (error) {
      console.error('Failed to create teacher:', error);
      toast.error('Failed to create teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="!max-w-5xl !max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Fill in the teacher information to add them to the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Basic personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (English) *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full name in English" />
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
                        <FormLabel>Full Name (Bengali)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full name in Bengali" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

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
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Contact details and address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Phone *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter primary phone number" />
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
                          <Input {...field} type="email" placeholder="Enter email address" />
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
                          <Textarea {...field} placeholder="Enter present address" />
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
                          <Textarea {...field} placeholder="Enter permanent address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Job details and qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teacher ID</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter teacher ID" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter designation" />
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
                        <div className="flex space-x-2">
                          <Input
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Add subject"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                          />
                          <Button type="button" variant="outline" onClick={addSubject}>
                            <IconPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {field.value.map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                              <button
                                type="button"
                                onClick={() => removeSubject(subject)}
                                className="ml-1 hover:text-destructive"
                              >
                                <IconX className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
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
                          <Input {...field} placeholder="Enter qualification" />
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
                          <Textarea {...field} placeholder="Enter experience details" />
                        </FormControl>
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
                  <CardDescription>Compensation details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="basicSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Salary</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} placeholder="Enter basic salary" />
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
                          <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} placeholder="Enter allowances" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium">Total Salary</div>
                    <div className="text-lg font-bold">
                      ৳{((form.watch('basicSalary') || 0) + (form.watch('allowances') || 0)).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Teacher'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}