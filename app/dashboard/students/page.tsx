'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/Table/data-table';
import { IconPlus, IconUsers } from '@tabler/icons-react';
import { studentsColumns } from './columns';
import { StudentDialog } from './student-dialog';
import { getStudents } from './actions';
import { Student, Session, Class, Batch, Section, StudentNote, Collection, AttendanceStudent, FeeMaster, Teacher } from '@prisma/client';

// Type for student with all relations and proper JSON field types
type StudentWithRelations = Student & {
  session: Session;
  class: Class;
  batch: Batch;
  section: Section;
  notes: (StudentNote & {
    staff: Teacher;
  })[];
  collections: (Collection & {
    feeMaster: FeeMaster;
  })[];
  attendanceStudent: AttendanceStudent[];
} & {
  personal: {
    nameEn: string;
    nameBn?: string;
    dob: string;
    gender: string;
    bloodGroup?: string;
    photoUrl?: string;
  };
  guardian: {
    fatherName: string;
    motherName: string;
    occupations: {
      father?: string;
      mother?: string;
    };
    contact: {
      smsNo: string;
      altNo?: string;
      email?: string;
    };
  };
  address: {
    present: string;
    permanent: string;
  };
};

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithRelations | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data as StudentWithRelations[]);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedStudent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student as StudentWithRelations);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedStudent(null);
    loadStudents(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student information, attendance, and academic records
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <IconPlus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Active students in current session
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s: any) => s.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Admissions</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter((s: any) => {
                const createdAt = new Date(s.createdAt);
                const thisMonth = new Date();
                return createdAt.getMonth() === thisMonth.getMonth() && 
                       createdAt.getFullYear() === thisMonth.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Students with pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>
            View and manage all student records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={students}
            columns={studentsColumns(handleEdit) as any}
            enableSearch={true}
            searchPlaceholder="Search students..."
            enablePagination={true}
            pageSize={10}
            showCreateButton={true}
            onCreateNew={handleCreateNew}
            createNewLabel="Add Student"
          />
        </CardContent>
      </Card>

      {/* Student Dialog */}
      <StudentDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        student={selectedStudent}
      />
    </div>
  );
}