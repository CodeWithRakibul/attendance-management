'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconDownload, IconFilter } from '@tabler/icons-react';
import { DataTable } from '@/components/Table/data-table';
import { getAttendanceHistory, exportAttendanceReport } from './actions';
import { toast } from 'sonner';

type StudentAttendanceRecord = {
  id: string;
  date: Date | string;
  status: string;
  student: {
    studentId: string;
    personal: {
      nameEn: string;
    };
    class: {
      name: string;
    };
  };
  batch: {
    name: string;
  };
};

type StaffAttendanceRecord = {
  id: string;
  date: Date | string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  staff?: {
    teacherId: string;
    personal: {
      nameEn: string;
    };
    designation: string;
  };
};

export function AttendanceHistory() {
  const [studentHistory, setStudentHistory] = useState<StudentAttendanceRecord[]>([]);
  const [staffHistory, setStaffHistory] = useState<StaffAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    loadHistory();
  }, [dateFrom, dateTo, selectedBatch, selectedStatus]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const filters = {
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        batchId: selectedBatch !== 'ALL' ? selectedBatch : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      };

      const [studentData, staffData] = await Promise.all([
        getAttendanceHistory('student', filters),
        getAttendanceHistory('staff', filters),
      ]);

      setStudentHistory(studentData as StudentAttendanceRecord[]);
      setStaffHistory(staffData as StaffAttendanceRecord[]);
    } catch (error) {
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'student' | 'staff', format: 'csv' | 'excel') => {
    try {
      const filters = {
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        batchId: selectedBatch !== 'ALL' ? selectedBatch : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
      };

      await exportAttendanceReport(type, format, filters);
      toast.success(`${type} attendance report exported successfully`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const studentColumns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }: any) => new Date(row.getValue('date')).toLocaleDateString(),
    },
    {
      accessorKey: 'student.studentId',
      header: 'Student ID',
    },
    {
      accessorKey: 'student.personal.nameEn',
      header: 'Student Name',
    },
    {
      accessorKey: 'student.class.name',
      header: 'Class',
    },
    {
      accessorKey: 'batch.name',
      header: 'Batch',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('status');
        return (
          <Badge 
            variant={
              status === 'PRESENT' ? 'default' : 
              status === 'LATE' ? 'secondary' : 
              'destructive'
            }
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  const staffColumns = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }: any) => new Date(row.getValue('date')).toLocaleDateString(),
    },
    {
      accessorKey: 'staff.teacherId',
      header: 'Staff ID',
    },
    {
      accessorKey: 'staff.personal.nameEn',
      header: 'Staff Name',
    },
    {
      accessorKey: 'staff.designation',
      header: 'Designation',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.getValue('status');
        return (
          <Badge 
            variant={
              status === 'PRESENT' ? 'default' : 
              status === 'LEAVE' ? 'secondary' : 
              'destructive'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'checkInTime',
      header: 'Check In',
      cell: ({ row }: any) => {
        const time = row.getValue('checkInTime');
        return time ? new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
      },
    },
    {
      accessorKey: 'checkOutTime',
      header: 'Check Out',
      cell: ({ row }: any) => {
        const time = row.getValue('checkOutTime');
        return time ? new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch">Batch</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="All batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All batches</SelectItem>
                  {/* TODO: Load batches dynamically */}
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="PRESENT">Present</SelectItem>
                  <SelectItem value="ABSENT">Absent</SelectItem>
                  <SelectItem value="LATE">Late</SelectItem>
                  <SelectItem value="LEAVE">Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Tables */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Student Attendance</TabsTrigger>
          <TabsTrigger value="staff">Staff Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Attendance History</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport('student', 'csv')}
                  >
                    <IconDownload className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport('student', 'excel')}
                  >
                    <IconDownload className="mr-2 h-4 w-4" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading student attendance history...</div>
              ) : (
                <DataTable
                  columns={studentColumns}
                  data={studentHistory}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Staff Attendance History</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport('staff', 'csv')}
                  >
                    <IconDownload className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport('staff', 'excel')}
                  >
                    <IconDownload className="mr-2 h-4 w-4" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading staff attendance history...</div>
              ) : (
                <DataTable
                  columns={staffColumns}
                  data={staffHistory}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}