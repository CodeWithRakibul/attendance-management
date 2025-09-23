'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  getAttendanceReportData, 
  exportAttendanceReport, 
  getSessions, 
  getClasses, 
  getBatches 
} from './actions';

interface Session {
  id: string;
  year: string;
  status: string;
}

interface Class {
  id: string;
  name: string;
  sessionId: string;
}

interface Batch {
  id: string;
  name: string;
  classId: string;
}

export function AttendanceReports() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const [filters, setFilters] = useState({
    reportType: 'daily-summary',
    attendanceType: 'student', // student or staff
    sessionId: '',
    classId: '',
    batchId: '',
    dateFrom: '',
    dateTo: '',
    month: '',
    year: '',
  });

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (filters.sessionId) {
      loadClasses(filters.sessionId);
    }
  }, [filters.sessionId]);

  useEffect(() => {
    if (filters.classId) {
      loadBatches(filters.classId);
    }
  }, [filters.classId]);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadClasses = async (sessionId: string) => {
    try {
      const data = await getClasses(sessionId);
      setClasses(data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const loadBatches = async (classId: string) => {
    try {
      const data = await getBatches(classId);
      setBatches(data);
    } catch (error) {
      console.error('Failed to load batches:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const data = await getAttendanceReportData(filters);
      setReportData(data);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    try {
      await exportAttendanceReport(filters, format);
    } catch (error) {
      console.error('Failed to export report:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { value: 'daily-summary', label: 'Daily Summary' },
    { value: 'monthly-summary', label: 'Monthly Summary' },
    { value: 'attendance-trends', label: 'Attendance Trends' },
    { value: 'low-attendance', label: 'Low Attendance Alert' },
    { value: 'perfect-attendance', label: 'Perfect Attendance' },
    { value: 'class-wise-summary', label: 'Class-wise Summary' },
  ];

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Report Configuration
          </CardTitle>
          <CardDescription>
            Generate comprehensive attendance reports for students and staff
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type and Attendance Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={filters.reportType}
                onValueChange={(value) => setFilters({ ...filters, reportType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendanceType">Attendance Type</Label>
              <Select
                value={filters.attendanceType}
                onValueChange={(value) => setFilters({ ...filters, attendanceType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attendance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student Attendance</SelectItem>
                  <SelectItem value="staff">Staff Attendance</SelectItem>
                  <SelectItem value="both">Both Student & Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range Filters */}
          {(filters.reportType === 'daily-summary' || filters.reportType === 'attendance-trends') && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <DatePicker
                  date={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                  onDateChange={(date) => 
                    setFilters({ ...filters, dateFrom: date?.toISOString().split('T')[0] || '' })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To Date</Label>
                <DatePicker
                  date={filters.dateTo ? new Date(filters.dateTo) : undefined}
                  onDateChange={(date) => 
                    setFilters({ ...filters, dateTo: date?.toISOString().split('T')[0] || '' })
                  }
                />
              </div>
            </div>
          )}

          {/* Monthly Filters */}
          {filters.reportType === 'monthly-summary' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select
                  value={filters.month}
                  onValueChange={(value) => setFilters({ ...filters, month: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={filters.year}
                  onValueChange={(value) => setFilters({ ...filters, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
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
          )}

          {/* Academic Filters (for student attendance) */}
          {filters.attendanceType !== 'staff' && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="session">Session</Label>
                <Select
                  value={filters.sessionId}
                  onValueChange={(value) => setFilters({ ...filters, sessionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sessions</SelectItem>
                    {sessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={filters.classId}
                  onValueChange={(value) => setFilters({ ...filters, classId: value })}
                  disabled={!filters.sessionId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Select
                  value={filters.batchId}
                  onValueChange={(value) => setFilters({ ...filters, batchId: value })}
                  disabled={!filters.classId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Batches</SelectItem>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={loading}>
              <BarChart3 className="h-4 w-4 mr-2" />
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
            {reportData && (
              <>
                <Button
                  variant="outline"
                  onClick={() => exportReport('pdf')}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportReport('excel')}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportReport('csv')}
                  disabled={loading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Report Preview</CardTitle>
            <CardDescription>
              Preview of the generated attendance report data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {reportData.summary?.totalPresent || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Present</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {reportData.summary?.totalAbsent || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Absent</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {reportData.summary?.totalLate || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Late</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.summary?.attendancePercentage || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Attendance %</div>
                </div>
              </div>

              {/* Attendance Trends Chart Placeholder */}
              {filters.reportType === 'attendance-trends' && (
                <div className="border rounded-lg p-6">
                  <h4 className="font-medium mb-4">Attendance Trends</h4>
                  <div className="h-64 bg-muted rounded flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                      <p>Attendance trends chart would be displayed here</p>
                      <p className="text-sm">Integration with recharts for visualization</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Data Table */}
              {reportData.records && reportData.records.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">Sample Attendance Records (First 10 records)</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 border-b">Date</th>
                          <th className="text-left p-3 border-b">Name</th>
                          <th className="text-left p-3 border-b">Type</th>
                          <th className="text-left p-3 border-b">Class/Designation</th>
                          <th className="text-left p-3 border-b">Status</th>
                          <th className="text-left p-3 border-b">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.records.slice(0, 10).map((record: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              {record.student?.personal?.nameEn || record.staff?.personal?.nameEn}
                            </td>
                            <td className="p-3">
                              <Badge variant="outline">
                                {record.student ? 'Student' : 'Staff'}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {record.student?.class?.name || record.staff?.designation}
                            </td>
                            <td className="p-3">
                              <Badge 
                                variant={
                                  record.status === 'PRESENT' ? 'default' :
                                  record.status === 'LATE' ? 'secondary' : 'destructive'
                                }
                              >
                                {record.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {record.checkInTime || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {reportData.records.length > 10 && (
                    <div className="p-3 text-sm text-muted-foreground text-center border-t">
                      ... and {reportData.records.length - 10} more records
                    </div>
                  )}
                </div>
              )}

              {/* Class-wise Summary */}
              {filters.reportType === 'class-wise-summary' && reportData.classSummary && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">Class-wise Attendance Summary</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 border-b">Class</th>
                          <th className="text-left p-3 border-b">Total Students</th>
                          <th className="text-left p-3 border-b">Present</th>
                          <th className="text-left p-3 border-b">Absent</th>
                          <th className="text-left p-3 border-b">Late</th>
                          <th className="text-left p-3 border-b">Attendance %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.classSummary.map((summary: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-medium">{summary.className}</td>
                            <td className="p-3">{summary.totalStudents}</td>
                            <td className="p-3 text-green-600">{summary.present}</td>
                            <td className="p-3 text-red-600">{summary.absent}</td>
                            <td className="p-3 text-yellow-600">{summary.late}</td>
                            <td className="p-3">
                              <Badge variant={summary.attendancePercentage >= 80 ? 'default' : 'destructive'}>
                                {summary.attendancePercentage}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}