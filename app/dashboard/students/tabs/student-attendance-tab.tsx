'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconCalendar, IconCheck, IconX, IconClock, IconTrendingUp, IconTrendingDown, IconFilter } from '@tabler/icons-react';
import { format } from 'date-fns';

interface StudentAttendanceTabProps {
  student: any;
}

export function StudentAttendanceTab({ student }: StudentAttendanceTabProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student?.attendanceStudent) {
      setAttendanceData(student.attendanceStudent);
    }
  }, [student]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <IconCheck className="h-4 w-4 text-green-600" />;
      case 'ABSENT':
        return <IconX className="h-4 w-4 text-red-600" />;
      case 'LATE':
        return <IconClock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PRESENT: 'default',
      ABSENT: 'destructive',
      LATE: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const calculateAttendanceStats = () => {
    if (!attendanceData.length) {
      return { total: 0, present: 0, absent: 0, late: 0, percentage: 0 };
    }

    const total = attendanceData.length;
    const present = attendanceData.filter(a => a.status === 'PRESENT').length;
    const absent = attendanceData.filter(a => a.status === 'ABSENT').length;
    const late = attendanceData.filter(a => a.status === 'LATE').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, percentage };
  };

  const stats = calculateAttendanceStats();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6">
      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Attendance recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <IconCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground">
              Days present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <IconX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">
              Days absent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
            {stats.percentage >= 75 ? (
              <IconTrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <IconTrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.percentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall attendance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filter Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading attendance data...</div>
          ) : attendanceData.length > 0 ? (
            <div className="space-y-3">
              {attendanceData.map((attendance, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(attendance.status)}
                    <div>
                      <p className="font-medium">
                        {format(new Date(attendance.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                      {attendance.batch && (
                        <p className="text-sm text-muted-foreground">
                          Batch: {attendance.batch.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(attendance.status)}
                    {attendance.markedAt && (
                      <p className="text-xs text-muted-foreground">
                        Marked at {format(new Date(attendance.markedAt), 'HH:mm')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No attendance records found for this student.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-green-600" />
              <span><strong>Present:</strong> Student attended the class on time</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="h-4 w-4 text-yellow-600" />
              <span><strong>Late:</strong> Student arrived after the designated time</span>
            </div>
            <div className="flex items-center gap-2">
              <IconX className="h-4 w-4 text-red-600" />
              <span><strong>Absent:</strong> Student did not attend the class</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Minimum 75% attendance is required for examination eligibility.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}