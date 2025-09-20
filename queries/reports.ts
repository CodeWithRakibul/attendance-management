import { connect, ZK_CONFIG, zkInstance } from "@/lib/zk"
import { Employee, Department, Position } from "./employees"
import { Shift, ShiftSchedule } from "./shiftManagement"
import { AttendanceRecord, AttendanceSummary, getAttendanceSummary, getAttendanceStatistics, getAttendanceByDateRange, getAttendanceByEmployee } from "./attendance"

// Report types
export interface Report {
    id: string;
    title: string;
    type: ReportType;
    description?: string;
    parameters: ReportParameters;
    data: any;
    generatedAt: Date;
    generatedBy: string;
    status: 'generating' | 'completed' | 'failed';
    filePath?: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum ReportType {
    ATTENDANCE_SUMMARY = 'attendance_summary',
    EMPLOYEE_ATTENDANCE = 'employee_attendance',
    DEPARTMENT_ATTENDANCE = 'department_attendance',
    SHIFT_ANALYSIS = 'shift_analysis',
    OVERTIME_REPORT = 'overtime_report',
    LATE_ARRIVAL_REPORT = 'late_arrival_report',
    ABSENTEEISM_REPORT = 'absenteeism_report',
    MONTHLY_REPORT = 'monthly_report',
    CUSTOM_REPORT = 'custom_report'
}

export interface ReportParameters {
    startDate: Date;
    endDate: Date;
    employeeIds?: string[];
    departmentIds?: string[];
    shiftIds?: string[];
    includeInactive?: boolean;
    format?: 'json' | 'csv' | 'pdf' | 'excel';
    groupBy?: 'day' | 'week' | 'month' | 'employee' | 'department';
}

// Attendance Summary Report
export interface AttendanceSummaryReport {
    reportId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    summary: {
        totalEmployees: number;
        totalWorkDays: number;
        averageAttendanceRate: number;
        totalWorkHours: number;
        totalOvertimeHours: number;
    };
    byDepartment: {
        department: string;
        employeeCount: number;
        averageAttendanceRate: number;
        totalWorkHours: number;
    }[];
    byEmployee: AttendanceSummary[];
    topPerformers: AttendanceSummary[];
    bottomPerformers: AttendanceSummary[];
    generatedAt: Date;
}

// Employee Attendance Report
export interface EmployeeAttendanceReport {
    reportId: string;
    employeeId: string;
    employeeName: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    summary: AttendanceSummary;
    dailyRecords: {
        date: Date;
        checkIn?: Date;
        checkOut?: Date;
        workHours: number;
        overtimeHours: number;
        status: string;
        notes?: string;
    }[];
    generatedAt: Date;
}

// Department Attendance Report
export interface DepartmentAttendanceReport {
    reportId: string;
    department: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    summary: {
        totalEmployees: number;
        averageAttendanceRate: number;
        totalWorkHours: number;
        totalOvertimeHours: number;
    };
    employees: AttendanceSummary[];
    generatedAt: Date;
}

// Shift Analysis Report
export interface ShiftAnalysisReport {
    reportId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    shifts: {
        shiftId: string;
        shiftName: string;
        employeeCount: number;
        averageAttendanceRate: number;
        totalWorkHours: number;
        totalOvertimeHours: number;
        commonIssues: string[];
    }[];
    generatedAt: Date;
}

// Overtime Report
export interface OvertimeReport {
    reportId: string;
    period: {
        startDate: Date;
        endDate: Date;
    };
    summary: {
        totalOvertimeHours: number;
        totalOvertimeCost: number;
        averageOvertimePerEmployee: number;
    };
    employees: {
        employeeId: string;
        employeeName: string;
        totalOvertimeHours: number;
        overtimeCost: number;
        overtimeDays: number;
    }[];
    generatedAt: Date;
}

// REPORT GENERATION FUNCTIONS

// Generate Attendance Summary Report
export async function generateAttendanceSummaryReport(parameters: ReportParameters): Promise<AttendanceSummaryReport> {
    try {
        const reportId = `RPT_ATT_SUM_${Date.now()}`;
        const statistics = await getAttendanceStatistics(parameters.startDate, parameters.endDate);
        
        // Get department-wise data
        const byDepartment = await getDepartmentAttendanceData(parameters.startDate, parameters.endDate);
        
        const report: AttendanceSummaryReport = {
            reportId,
            period: {
                startDate: parameters.startDate,
                endDate: parameters.endDate
            },
            summary: {
                totalEmployees: statistics.totalEmployees,
                totalWorkDays: Math.ceil((parameters.endDate.getTime() - parameters.startDate.getTime()) / (1000 * 60 * 60 * 24)),
                averageAttendanceRate: statistics.averageAttendanceRate,
                totalWorkHours: statistics.topPerformers.reduce((sum, emp) => sum + emp.totalWorkHours, 0),
                totalOvertimeHours: statistics.topPerformers.reduce((sum, emp) => sum + emp.totalOvertimeHours, 0)
            },
            byDepartment,
            byEmployee: [...statistics.topPerformers, ...statistics.bottomPerformers],
            topPerformers: statistics.topPerformers,
            bottomPerformers: statistics.bottomPerformers,
            generatedAt: new Date()
        };
        
        return report;
    } catch (error) {
        console.error('Error generating attendance summary report:', error);
        throw error;
    }
}

// Generate Employee Attendance Report
export async function generateEmployeeAttendanceReport(employeeId: string, parameters: ReportParameters): Promise<EmployeeAttendanceReport> {
    try {
        const reportId = `RPT_EMP_ATT_${employeeId}_${Date.now()}`;
        const summary = await getAttendanceSummary(employeeId, parameters.startDate, parameters.endDate);
        const records = await getAttendanceByEmployee(employeeId, parameters.startDate, parameters.endDate);
        
        const dailyRecords = records.map(record => ({
            date: new Date(record.recordTime),
            checkIn: record.checkInTime,
            checkOut: record.checkOutTime,
            workHours: record.workHours || 0,
            overtimeHours: record.overtimeHours || 0,
            status: record.status,
            notes: record.notes
        }));
        
        const report: EmployeeAttendanceReport = {
            reportId,
            employeeId,
            employeeName: summary.employeeName,
            period: {
                startDate: parameters.startDate,
                endDate: parameters.endDate
            },
            summary,
            dailyRecords,
            generatedAt: new Date()
        };
        
        return report;
    } catch (error) {
        console.error('Error generating employee attendance report:', error);
        throw error;
    }
}

// Generate Department Attendance Report
export async function generateDepartmentAttendanceReport(department: string, parameters: ReportParameters): Promise<DepartmentAttendanceReport> {
    try {
        const reportId = `RPT_DEPT_ATT_${department}_${Date.now()}`;
        
        // Get all employees in the department
        const employees = await getEmployeesByDepartment(department as Department);
        const employeeIds = employees.map(emp => emp.employeeId);
        
        // Get attendance summaries for all employees in the department
        const summaries = await Promise.all(
            employeeIds.map(empId => getAttendanceSummary(empId, parameters.startDate, parameters.endDate))
        );
        
        const summary = {
            totalEmployees: summaries.length,
            averageAttendanceRate: summaries.reduce((sum, s) => sum + s.attendanceRate, 0) / summaries.length,
            totalWorkHours: summaries.reduce((sum, s) => sum + s.totalWorkHours, 0),
            totalOvertimeHours: summaries.reduce((sum, s) => sum + s.totalOvertimeHours, 0)
        };
        
        const report: DepartmentAttendanceReport = {
            reportId,
            department,
            period: {
                startDate: parameters.startDate,
                endDate: parameters.endDate
            },
            summary,
            employees: summaries,
            generatedAt: new Date()
        };
        
        return report;
    } catch (error) {
        console.error('Error generating department attendance report:', error);
        throw error;
    }
}

// Generate Shift Analysis Report
export async function generateShiftAnalysisReport(parameters: ReportParameters): Promise<ShiftAnalysisReport> {
    try {
        const reportId = `RPT_SHIFT_ANALYSIS_${Date.now()}`;
        
        // Get all shifts
        const shifts = await getShifts();
        const shiftAnalysis = await Promise.all(
            shifts.map(async (shift) => {
                const employees = await getEmployeesByShift(shift.id);
                const summaries = await Promise.all(
                    employees.map(emp => getAttendanceSummary(emp.employeeId, parameters.startDate, parameters.endDate))
                );
                
                return {
                    shiftId: shift.id,
                    shiftName: shift.name,
                    employeeCount: employees.length,
                    averageAttendanceRate: summaries.reduce((sum, s) => sum + s.attendanceRate, 0) / summaries.length,
                    totalWorkHours: summaries.reduce((sum, s) => sum + s.totalWorkHours, 0),
                    totalOvertimeHours: summaries.reduce((sum, s) => sum + s.totalOvertimeHours, 0),
                    commonIssues: getCommonIssues(summaries)
                };
            })
        );
        
        const report: ShiftAnalysisReport = {
            reportId,
            period: {
                startDate: parameters.startDate,
                endDate: parameters.endDate
            },
            shifts: shiftAnalysis,
            generatedAt: new Date()
        };
        
        return report;
    } catch (error) {
        console.error('Error generating shift analysis report:', error);
        throw error;
    }
}

// Generate Overtime Report
export async function generateOvertimeReport(parameters: ReportParameters): Promise<OvertimeReport> {
    try {
        const reportId = `RPT_OVERTIME_${Date.now()}`;
        
        const records = await getAttendanceByDateRange(parameters.startDate, parameters.endDate);
        const uniqueEmployees = [...new Set(records.map(r => r.employeeId))];
        
        const employeeOvertime = await Promise.all(
            uniqueEmployees.map(async (empId) => {
                const empRecords = records.filter(r => r.employeeId === empId);
                const totalOvertimeHours = empRecords.reduce((sum, record) => sum + (record.overtimeHours || 0), 0);
                const overtimeDays = empRecords.filter(r => (r.overtimeHours || 0) > 0).length;
                
                return {
                    employeeId: empId,
                    employeeName: `Employee ${empId}`, // In real app, fetch from employee data
                    totalOvertimeHours,
                    overtimeCost: totalOvertimeHours * 25, // Assuming $25/hour overtime rate
                    overtimeDays
                };
            })
        );
        
        const summary = {
            totalOvertimeHours: employeeOvertime.reduce((sum, emp) => sum + emp.totalOvertimeHours, 0),
            totalOvertimeCost: employeeOvertime.reduce((sum, emp) => sum + emp.overtimeCost, 0),
            averageOvertimePerEmployee: employeeOvertime.reduce((sum, emp) => sum + emp.totalOvertimeHours, 0) / employeeOvertime.length
        };
        
        const report: OvertimeReport = {
            reportId,
            period: {
                startDate: parameters.startDate,
                endDate: parameters.endDate
            },
            summary,
            employees: employeeOvertime,
            generatedAt: new Date()
        };
        
        return report;
    } catch (error) {
        console.error('Error generating overtime report:', error);
        throw error;
    }
}

// REPORT MANAGEMENT CRUD OPERATIONS

// CREATE - Save report
export async function saveReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
    try {
        const newReport: Report = {
            ...report,
            id: `RPT_${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // In a real application, you would save to database
        return newReport;
    } catch (error) {
        console.error('Error saving report:', error);
        throw error;
    }
}

// READ - Get all reports
export async function getReports(): Promise<Report[]> {
    try {
        // In a real application, you would fetch from database
        return [];
    } catch (error) {
        console.error('Error getting reports:', error);
        return [];
    }
}

// READ - Get report by ID
export async function getReportById(id: string): Promise<Report | null> {
    try {
        const reports = await getReports();
        return reports.find(report => report.id === id) || null;
    } catch (error) {
        console.error('Error getting report by ID:', error);
        return null;
    }
}

// READ - Get reports by type
export async function getReportsByType(type: ReportType): Promise<Report[]> {
    try {
        const reports = await getReports();
        return reports.filter(report => report.type === type);
    } catch (error) {
        console.error('Error getting reports by type:', error);
        return [];
    }
}

// UPDATE - Update report
export async function updateReport(id: string, updates: Partial<Omit<Report, 'id' | 'createdAt'>>): Promise<boolean> {
    try {
        // In a real application, you would update in database
        return true;
    } catch (error) {
        console.error('Error updating report:', error);
        return false;
    }
}

// DELETE - Delete report
export async function deleteReport(id: string): Promise<boolean> {
    try {
        // In a real application, you would delete from database
        return true;
    } catch (error) {
        console.error('Error deleting report:', error);
        return false;
    }
}

// UTILITY FUNCTIONS

// Get department attendance data
async function getDepartmentAttendanceData(startDate: Date, endDate: Date): Promise<{
    department: string;
    employeeCount: number;
    averageAttendanceRate: number;
    totalWorkHours: number;
}[]> {
    try {
        const departments = Object.values(Department);
        const results = await Promise.all(
            departments.map(async (dept) => {
                const employees = await getEmployeesByDepartment(dept);
                const summaries = await Promise.all(
                    employees.map(emp => getAttendanceSummary(emp.employeeId, startDate, endDate))
                );
                
                return {
                    department: dept,
                    employeeCount: employees.length,
                    averageAttendanceRate: summaries.reduce((sum, s) => sum + s.attendanceRate, 0) / summaries.length,
                    totalWorkHours: summaries.reduce((sum, s) => sum + s.totalWorkHours, 0)
                };
            })
        );
        
        return results;
    } catch (error) {
        console.error('Error getting department attendance data:', error);
        return [];
    }
}

// Get employees by department (placeholder - implement based on your employee system)
async function getEmployeesByDepartment(department: Department): Promise<Employee[]> {
    try {
        // In a real application, you would fetch from your employee database
        return [];
    } catch (error) {
        console.error('Error getting employees by department:', error);
        return [];
    }
}

// Get employees by shift (placeholder - implement based on your shift system)
async function getEmployeesByShift(shiftId: string): Promise<Employee[]> {
    try {
        // In a real application, you would fetch from your shift assignment system
        return [];
    } catch (error) {
        console.error('Error getting employees by shift:', error);
        return [];
    }
}

// Get common issues from attendance summaries
function getCommonIssues(summaries: AttendanceSummary[]): string[] {
    const issues: string[] = [];
    
    const lateCount = summaries.filter(s => s.lateDays > 0).length;
    const earlyLeaveCount = summaries.filter(s => s.earlyLeaveDays > 0).length;
    const absentCount = summaries.filter(s => s.absentDays > 0).length;
    
    if (lateCount > summaries.length * 0.3) {
        issues.push('High late arrival rate');
    }
    if (earlyLeaveCount > summaries.length * 0.2) {
        issues.push('Frequent early departures');
    }
    if (absentCount > summaries.length * 0.1) {
        issues.push('High absenteeism rate');
    }
    
    return issues;
}

// Export report to different formats
export async function exportReport(reportId: string, format: 'json' | 'csv' | 'pdf' | 'excel'): Promise<string> {
    try {
        const report = await getReportById(reportId);
        if (!report) {
            throw new Error('Report not found');
        }
        
        // In a real application, you would implement actual export functionality
        const fileName = `${report.title}_${new Date().toISOString().split('T')[0]}.${format}`;
        
        switch (format) {
            case 'json':
                return JSON.stringify(report.data, null, 2);
            case 'csv':
                return convertToCSV(report.data);
            case 'pdf':
                return `PDF export for ${fileName}`;
            case 'excel':
                return `Excel export for ${fileName}`;
            default:
                throw new Error('Unsupported format');
        }
    } catch (error) {
        console.error('Error exporting report:', error);
        throw error;
    }
}

// Convert data to CSV format
function convertToCSV(data: any): string {
    // Simple CSV conversion - in a real application, use a proper CSV library
    if (Array.isArray(data)) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        return [headers, ...rows].join('\n');
    }
    
    return JSON.stringify(data);
}

// Schedule report generation
export async function scheduleReport(type: ReportType, parameters: ReportParameters, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string; // Format: "HH:MM"
    email?: string;
}): Promise<boolean> {
    try {
        // In a real application, you would implement a job scheduler
        console.log(`Scheduled ${type} report to run ${schedule.frequency} at ${schedule.time}`);
        return true;
    } catch (error) {
        console.error('Error scheduling report:', error);
        return false;
    }
}
