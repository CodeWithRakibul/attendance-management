'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconCalendar, IconClock, IconTrendingUp, IconTrendingDown, IconCheck, IconX, IconClock2 } from '@tabler/icons-react';
import { format } from 'date-fns';

interface TeacherAttendanceTabProps {
  teacherId: string;
}

export function TeacherAttendanceTab({ teacherId }: TeacherAttendanceTabProps) {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    loadAttendanceData();
  }, [teacherId, selectedMonth, selectedYear]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockData = [
        { id: '1', date: '2024-01-15', status: 'PRESENT', checkIn: '08:30', checkOut: '17:00' },
        { id: '2', date: '2024-01-16', status: 'PRESENT', checkIn: '08:25', checkOut: '17:05' },
        { id: '3', date: '2024-01-17', status: 'LATE', checkIn: '09:15', checkOut: '17:00' },
        { id: '4', date: '2024-01-18', status: 'ABSENT', checkIn: null, checkOut: null },
        { id: '5', date: '2024-01-19', status: 'PRESENT', checkIn: '08:20', checkOut: '16:55' },
      ];
      setAttendanceData(mockData);
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><IconCheck className="mr-1 h-3 w-3" />Present</Badge>;
      case 'ABSENT':
        return <Badge variant="destructive"><IconX className="mr-1 h-3 w-3" />Absent</Badge>;
      case 'LATE':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><IconClock2 className="mr-1 h-3 w-3" />Late</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateStats = () => {
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(d => d.status === 'PRESENT').length;
    const lateDays = attendanceData.filter(d => d.status === 'LATE').length;
    const absentDays = attendanceData.filter(d => d.status === 'ABSENT').length;
    const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays * 100).toFixed(1) : '0';

    return { totalDays, presentDays, lateDays, absentDays, attendanceRate };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <IconCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentDays}</div>
            <p className="text-xs text-muted-foreground">Out of {stats.totalDays} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Days</CardTitle>
            <IconClock2 className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lateDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <IconX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.absentDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Daily attendance records for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No attendance records found for the selected period.
              </div>
            ) : (
              attendanceData.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <IconCalendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    {getStatusBadge(record.status)}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {record.checkIn && (
                      <div className="flex items-center space-x-1">
                        <IconClock className="h-4 w-4" />
                        <span>In: {record.checkIn}</span>
                      </div>
                    )}
                    {record.checkOut && (
                      <div className="flex items-center space-x-1">
                        <IconClock className="h-4 w-4" />
                        <span>Out: {record.checkOut}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Regular working hours: 8:30 AM - 5:00 PM</p>
          <p>• Late arrival: After 9:00 AM</p>
          <p>• Minimum attendance requirement: 90% per month</p>
          <p>• Notify administration for planned absences</p>
        </CardContent>
      </Card>
    </div>
  );
}