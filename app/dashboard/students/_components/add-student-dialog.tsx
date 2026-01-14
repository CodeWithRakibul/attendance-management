'use client';

import { useState, useTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    IconPlus,
    IconUser,
    IconPhone,
    IconMail,
    IconCalendar,
    IconMapPin,
    IconLoader2
} from '@tabler/icons-react';
import { createStudentAction } from '../actions';
import { toast } from 'sonner';
import { StudentStatus } from '@prisma/client';

interface AddStudentDialogProps {
    children: React.ReactNode;
    sessions: Array<{ id: string; year: string }>;
    classes: Array<{ id: string; name: string }>;
    batches: Array<{ id: string; name: string }>;
    sections: Array<{ id: string; name: string }>;
}

export function AddStudentDialog({
    children,
    sessions,
    classes,
    batches,
    sections
}: AddStudentDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Information
        nameEn: '',
        nameBn: '',
        fatherNameEn: '',
        fatherNameBn: '',
        motherNameEn: '',
        motherNameBn: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        religion: '',

        // Contact Information
        phone: '',
        email: '',
        address: '',
        emergencyContact: '',

        // Academic Information
        sessionId: sessions.find(s => s.year === new Date().getFullYear().toString())?.id || sessions[0]?.id || '',
        classId: '',
        batchId: '',
        sectionId: '',
        rollNumber: '',
        registrationNumber: '',

        // Additional Information
        previousSchool: '',
        guardianOccupation: '',
        monthlyIncome: '',
        notes: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        startTransition(async () => {
            try {
                const result = await createStudentAction({
                    studentId: `STU${Date.now()}`,
                    sessionId: formData.sessionId,
                    classId: formData.classId,
                    batchId: formData.batchId,
                    sectionId: formData.sectionId,
                    roll: formData.rollNumber,
                    personal: {
                        nameEn: formData.nameEn,
                        nameBn: formData.nameBn,
                        dob: formData.dateOfBirth,
                        gender: formData.gender as 'MALE' | 'FEMALE',
                        bloodGroup: formData.bloodGroup
                    },
                    guardian: {
                        fatherName: formData.fatherNameEn,
                        motherName: formData.motherNameEn,
                        fatherOccupation: formData.guardianOccupation,
                        contact: {
                            smsNo: formData.phone,
                            email: formData.email
                        }
                    },
                    address: {
                        present: formData.address
                    },
                    status: 'ACTIVE' as StudentStatus,
                    continuityTick: false
                });

                if (result.success) {
                    toast.success('Student added successfully!');
                    setOpen(false);
                    setCurrentStep(1);
                    setFormData({
                        nameEn: '',
                        nameBn: '',
                        fatherNameEn: '',
                        fatherNameBn: '',
                        motherNameEn: '',
                        motherNameBn: '',
                        dateOfBirth: '',
                        gender: '',
                        bloodGroup: '',
                        religion: '',
                        phone: '',
                        email: '',
                        address: '',
                        emergencyContact: '',
                        sessionId: sessions.find(s => s.year === new Date().getFullYear().toString())?.id || sessions[0]?.id || '',
                        classId: '',
                        batchId: '',
                        sectionId: '',
                        rollNumber: '',
                        registrationNumber: '',
                        previousSchool: '',
                        guardianOccupation: '',
                        monthlyIncome: '',
                        notes: ''
                    });
                } else {
                    toast.error(result.error || 'Failed to add student');
                }
            } catch (error) {
                toast.error('An unexpected error occurred');
            }
        });
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.nameEn && formData.fatherNameEn && formData.gender;
            case 2:
                return formData.phone || formData.email;
            case 3:
                return formData.sessionId && formData.classId;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='nameEn'>Name (English) *</Label>
                                <Input
                                    id='nameEn'
                                    value={formData.nameEn}
                                    onChange={(e) => handleInputChange('nameEn', e.target.value)}
                                    placeholder='Enter student name'
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='nameBn'>Name (Bangla)</Label>
                                <Input
                                    id='nameBn'
                                    value={formData.nameBn}
                                    onChange={(e) => handleInputChange('nameBn', e.target.value)}
                                    placeholder='শিক্ষার্থীর নাম'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='fatherNameEn'>Father's Name (English) *</Label>
                                <Input
                                    id='fatherNameEn'
                                    value={formData.fatherNameEn}
                                    onChange={(e) =>
                                        handleInputChange('fatherNameEn', e.target.value)
                                    }
                                    placeholder="Enter father's name"
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='fatherNameBn'>Father's Name (Bangla)</Label>
                                <Input
                                    id='fatherNameBn'
                                    value={formData.fatherNameBn}
                                    onChange={(e) =>
                                        handleInputChange('fatherNameBn', e.target.value)
                                    }
                                    placeholder='পিতার নাম'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='motherNameEn'>Mother's Name (English)</Label>
                                <Input
                                    id='motherNameEn'
                                    value={formData.motherNameEn}
                                    onChange={(e) =>
                                        handleInputChange('motherNameEn', e.target.value)
                                    }
                                    placeholder="Enter mother's name"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='motherNameBn'>Mother's Name (Bangla)</Label>
                                <Input
                                    id='motherNameBn'
                                    value={formData.motherNameBn}
                                    onChange={(e) =>
                                        handleInputChange('motherNameBn', e.target.value)
                                    }
                                    placeholder='মাতার নাম'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-3 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                                <Input
                                    id='dateOfBirth'
                                    type='date'
                                    value={formData.dateOfBirth}
                                    onChange={(e) =>
                                        handleInputChange('dateOfBirth', e.target.value)
                                    }
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='gender'>Gender *</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => handleInputChange('gender', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select gender' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='MALE'>Male</SelectItem>
                                        <SelectItem value='FEMALE'>Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='bloodGroup'>Blood Group</Label>
                                <Select
                                    value={formData.bloodGroup}
                                    onValueChange={(value) =>
                                        handleInputChange('bloodGroup', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select blood group' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='A+'>A+</SelectItem>
                                        <SelectItem value='A-'>A-</SelectItem>
                                        <SelectItem value='B+'>B+</SelectItem>
                                        <SelectItem value='B-'>B-</SelectItem>
                                        <SelectItem value='AB+'>AB+</SelectItem>
                                        <SelectItem value='AB-'>AB-</SelectItem>
                                        <SelectItem value='O+'>O+</SelectItem>
                                        <SelectItem value='O-'>O-</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='phone'>Phone Number</Label>
                                <Input
                                    id='phone'
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder='01XXXXXXXXX'
                                    maxLength={11}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='email'>Email Address</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder='student@example.com'
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='address'>Address</Label>
                            <Textarea
                                id='address'
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder='Enter full address'
                                rows={3}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='emergencyContact'>Emergency Contact</Label>
                            <Input
                                id='emergencyContact'
                                value={formData.emergencyContact}
                                onChange={(e) =>
                                    handleInputChange('emergencyContact', e.target.value)
                                }
                                placeholder='Emergency contact number'
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='sessionId'>Academic Session *</Label>
                                <Select
                                    value={formData.sessionId}
                                    onValueChange={(value) => handleInputChange('sessionId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select session' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sessions.map((session) => (
                                            <SelectItem key={session.id} value={session.id}>
                                                {session.year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='classId'>Class *</Label>
                                <Select
                                    value={formData.classId}
                                    onValueChange={(value) => handleInputChange('classId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select class' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='batchId'>Batch</Label>
                                <Select
                                    value={formData.batchId}
                                    onValueChange={(value) => handleInputChange('batchId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select batch' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {batches.map((batch) => (
                                            <SelectItem key={batch.id} value={batch.id}>
                                                {batch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='sectionId'>Section</Label>
                                <Select
                                    value={formData.sectionId}
                                    onValueChange={(value) => handleInputChange('sectionId', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select section' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sections.map((section) => (
                                            <SelectItem key={section.id} value={section.id}>
                                                {section.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='rollNumber'>Roll Number</Label>
                                <Input
                                    id='rollNumber'
                                    value={formData.rollNumber}
                                    onChange={(e) =>
                                        handleInputChange('rollNumber', e.target.value)
                                    }
                                    placeholder='Enter roll number'
                                    type='number'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='registrationNumber'>Registration Number</Label>
                                <Input
                                    id='registrationNumber'
                                    value={formData.registrationNumber}
                                    onChange={(e) =>
                                        handleInputChange('registrationNumber', e.target.value)
                                    }
                                    placeholder='Enter registration number'
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='previousSchool'>Previous School</Label>
                            <Input
                                id='previousSchool'
                                value={formData.previousSchool}
                                onChange={(e) =>
                                    handleInputChange('previousSchool', e.target.value)
                                }
                                placeholder='Name of previous school'
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='guardianOccupation'>Guardian's Occupation</Label>
                                <Input
                                    id='guardianOccupation'
                                    value={formData.guardianOccupation}
                                    onChange={(e) =>
                                        handleInputChange('guardianOccupation', e.target.value)
                                    }
                                    placeholder="Guardian's occupation"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='monthlyIncome'>Monthly Income</Label>
                                <Input
                                    id='monthlyIncome'
                                    type='number'
                                    value={formData.monthlyIncome}
                                    onChange={(e) =>
                                        handleInputChange('monthlyIncome', e.target.value)
                                    }
                                    placeholder='Family monthly income'
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='notes'>Additional Notes</Label>
                            <Textarea
                                id='notes'
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder='Any additional information about the student'
                                rows={4}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const stepTitles = [
        'Personal Information',
        'Contact Details',
        'Academic Information',
        'Additional Details'
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <div className='p-2 bg-blue-100 rounded-full'>
                            <IconPlus className='h-4 w-4 text-blue-600' />
                        </div>
                        Add New Student
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the student information. Fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                <div className='flex items-center justify-between mb-6'>
                    {stepTitles.map((title, index) => (
                        <div key={index} className='flex items-center'>
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    currentStep > index + 1
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : currentStep === index + 1
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'border-gray-300 text-gray-400'
                                }`}
                            >
                                {currentStep > index + 1 ? '✓' : (index + 1).toString()}
                            </div>
                            <div className='ml-2 hidden sm:block'>
                                <div
                                    className={`text-sm font-medium ${
                                        currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-400'
                                    }`}
                                >
                                    {title}
                                </div>
                            </div>
                            {index < stepTitles.length - 1 && (
                                <div
                                    className={`w-12 h-0.5 mx-4 ${
                                        currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>{stepTitles[currentStep - 1]}</CardTitle>
                        </CardHeader>
                        <CardContent>{renderStepContent()}</CardContent>
                    </Card>

                    <DialogFooter className='mt-6'>
                        <div className='flex justify-between w-full'>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={prevStep}
                                disabled={currentStep === 1}
                            >
                                Previous
                            </Button>

                            <div className='flex gap-2'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>

                                {currentStep < 4 ? (
                                    <Button
                                        type='button'
                                        onClick={nextStep}
                                        disabled={!isStepValid(currentStep)}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button type='submit' disabled={isPending} className='gap-2'>
                                        {isPending && (
                                            <IconLoader2 className='h-4 w-4 animate-spin' />
                                        )}
                                        Add Student
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
