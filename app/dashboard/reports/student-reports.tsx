'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Users, Filter, Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  getStudentReportData, 
  exportStudentReport, 
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

export function StudentReports() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const [filters, setFilters] = useState({
    sessionId: '',
    classId: '',
    batchId: '',
    status: '',
    reportType: 'student-list',
  });

  const [selectedFields, setSelectedFields] = useState({
    personalInfo: true,
    guardianInfo: true,
    academicInfo: true,
    contactInfo: true,
    addressInfo: false,
    feeInfo: false,
    attendanceInfo: false,
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
      const data = await getStudentReportData(filters);
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
      await exportStudentReport(filters, format);
    } catch (error) {
      console.error('Failed to export report:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { value: 'student-list', label: 'Student List' },
    { value: 'guardian-contacts', label: 'Guardian Contact List' },
    { value: 'gender-ratio', label: 'Gender Ratio Report' },
    { value: 'admission-trend', label: 'Admission Trend Report' },
    { value: 'class-wise-summary', label: 'Class-wise Summary' },
    { value: 'inactive-students', label: 'Inactive Students Report' },
  ];

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Report Configuration
          </CardTitle>
          <CardDescription>
            Configure and generate various student reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
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
              <Label htmlFor="status">Student Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="GRADUATED">Graduated</SelectItem>
                  <SelectItem value="TRANSFERRED">Transferred</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters */}
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

          {/* Field Selection */}
          <div className="space-y-4">
            <Label>Include Fields in Report</Label>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(selectedFields).map(([field, checked]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={(checked) =>
                      setSelectedFields({ ...selectedFields, [field]: checked as boolean })
                    }
                  />
                  <Label htmlFor={field} className="text-sm font-normal">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={generateReport} disabled={loading}>
              <FileText className="h-4 w-4 mr-2" />
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
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              Preview of the generated report data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.summary?.totalStudents || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {reportData.summary?.activeStudents || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Students</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {reportData.summary?.maleStudents || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Male Students</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {reportData.summary?.femaleStudents || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Female Students</div>
                </div>
              </div>

              {/* Sample Data Table */}
              {reportData.students && reportData.students.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h4 className="font-medium">Sample Data (First 5 records)</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 border-b">Student ID</th>
                          <th className="text-left p-3 border-b">Name</th>
                          <th className="text-left p-3 border-b">Class</th>
                          <th className="text-left p-3 border-b">Roll</th>
                          <th className="text-left p-3 border-b">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.students.slice(0, 5).map((student: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">{student.studentId}</td>
                            <td className="p-3">{student.personal?.nameEn}</td>
                            <td className="p-3">{student.class?.name}</td>
                            <td className="p-3">{student.roll}</td>
                            <td className="p-3">
                              <Badge variant={student.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                {student.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {reportData.students.length > 5 && (
                    <div className="p-3 text-sm text-muted-foreground text-center border-t">
                      ... and {reportData.students.length - 5} more records
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}