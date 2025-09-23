'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/Table/data-table';
import { IconPlus, IconUsers, IconFilter, IconX, IconSearch } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { studentsColumns } from './columns';
import { StudentDialog } from './student-dialog';
import { getStudents } from './actions';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data as any[]);
      setFilteredStudents(data as any[]);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on current filters
  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student => {
        const personal = student.personal as any;
        const guardian = student.guardian as any;
        return (
          personal?.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          personal?.nameBn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guardian?.fatherName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Class filter
    if (classFilter !== 'all') {
      filtered = filtered.filter(student => student.class.name === classFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    // Batch filter
    if (batchFilter !== 'all') {
      filtered = filtered.filter(student => student.batch.name === batchFilter);
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(student => {
        const personal = student.personal as any;
        return personal?.gender === genderFilter;
      });
    }

    // Section filter
    if (sectionFilter !== 'all') {
      filtered = filtered.filter(student => student.section.name === sectionFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, classFilter, statusFilter, batchFilter, genderFilter, sectionFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setClassFilter('all');
    setStatusFilter('all');
    setBatchFilter('all');
    setGenderFilter('all');
    setSectionFilter('all');
  };

  // Get unique values for filter options
  const uniqueClasses = [...new Set(students.map(s => s.class.name))];
  const uniqueBatches = [...new Set(students.map(s => s.batch.name))];
  const uniqueSections = [...new Set(students.map(s => s.section.name))];

  const handleCreateNew = () => {
    setSelectedStudent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
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
            <div className="text-2xl font-bold">{filteredStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Filtered results
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
              {filteredStudents.filter((s: any) => s.status === 'ACTIVE').length}
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
              {filteredStudents.filter((s: any) => {
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconFilter className="h-4 w-4" />
              Filters
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredStudents.length} of {students.length} students
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or father's name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              >
                <IconX className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {uniqueSections.map(section => (
                    <SelectItem key={section} value={section}>Section {section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch</label>
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {uniqueBatches.map(batch => (
                    <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DISABLED">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(searchTerm || classFilter !== 'all' || statusFilter !== 'all' || batchFilter !== 'all' || genderFilter !== 'all' || sectionFilter !== 'all') && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchTerm}
                    <IconX className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                  </Badge>
                )}
                {classFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Class: {classFilter}
                    <IconX className="h-3 w-3 cursor-pointer" onClick={() => setClassFilter('all')} />
                  </Badge>
                )}
                {sectionFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Section: {sectionFilter}
                    <IconX className="h-3 w-3 cursor-pointer" onClick={() => setSectionFilter('all')} />
                  </Badge>
                )}
                {batchFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Batch: {batchFilter}
                    <IconX className="h-3 w-3 cursor-pointer" onClick={() => setBatchFilter('all')} />
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <IconX className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter('all')} />
                  </Badge>
                )}
                {genderFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    Gender: {genderFilter}
                    <IconX className="h-3 w-3 cursor-pointer" onClick={() => setGenderFilter('all')} />
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <IconX className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
            data={filteredStudents}
            columns={studentsColumns(handleEdit) as any}
            enableSearch={false}
            enablePagination={true}
            pageSize={10}
            showCreateButton={false}
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