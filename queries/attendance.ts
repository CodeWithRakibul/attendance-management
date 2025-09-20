import { connect, ZK_CONFIG, zkInstance } from "@/lib/zk"

// Attendance interface based on zklib-js types
export interface Attendance {
    userSn: number;
    deviceUserId: string;
    recordTime: string;
    ip: string;
}

// Enhanced attendance record with additional fields
export interface AttendanceRecord extends Attendance {
    id: string;
    employeeId: string;
    employeeName: string;
    checkInTime?: Date;
    checkOutTime?: Date;
    workHours?: number;
    overtimeHours?: number;
    status: 'present' | 'absent' | 'late' | 'early-leave' | 'overtime';
    shiftId?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Attendance summary for reporting
export interface AttendanceSummary {
    employeeId: string;
    employeeName: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    earlyLeaveDays: number;
    totalWorkHours: number;
    totalOvertimeHours: number;
    attendanceRate: number;
}

// READ - Get all attendance records from ZK device
export async function getAttendance(): Promise<Attendance[]> {
    try {
    await connect();
    const logs = await zkInstance.getAttendances();
    return logs;
    } catch (error) {
        console.error('Error getting attendance:', error);
        return [];
    }
}

// READ - Get attendance with progress callback
export async function getAttendanceWithCallback(): Promise<Attendance[]> {
    try {
    await connect();
        const logs = await zkInstance.getAttendances();
        return logs;
    } catch (error) {
        console.error('Error getting attendance with callback:', error);
        return [];
    }
}

// READ - Get attendance records for a specific employee
export async function getAttendanceByEmployee(employeeId: string, startDate?: Date, endDate?: Date): Promise<AttendanceRecord[]> {
    try {
        const attendanceLogs = await getAttendance();
        const employeeRecords = attendanceLogs.filter(log => log.deviceUserId === employeeId);
        
        // Convert to enhanced records
        const records: AttendanceRecord[] = employeeRecords.map(log => ({
            ...log,
            id: `ATT_${log.userSn}_${log.recordTime}`,
            employeeId: log.deviceUserId,
            employeeName: `Employee ${log.deviceUserId}`, // In real app, fetch from employee data
            recordTime: log.recordTime,
            status: 'present',
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        
        // Filter by date range if provided
        if (startDate && endDate) {
            return records.filter(record => {
                const recordDate = new Date(record.recordTime);
                return recordDate >= startDate && recordDate <= endDate;
            });
        }
        
        return records;
    } catch (error) {
        console.error('Error getting attendance by employee:', error);
        return [];
    }
}

// READ - Get attendance records for a date range
export async function getAttendanceByDateRange(startDate: Date, endDate: Date): Promise<AttendanceRecord[]> {
    try {
        const attendanceLogs = await getAttendance();
        
        const records: AttendanceRecord[] = attendanceLogs
            .filter(log => {
                const logDate = new Date(log.recordTime);
                return logDate >= startDate && logDate <= endDate;
            })
            .map(log => ({
                ...log,
                id: `ATT_${log.userSn}_${log.recordTime}`,
                employeeId: log.deviceUserId,
                employeeName: `Employee ${log.deviceUserId}`,
                recordTime: log.recordTime,
                status: 'present',
                createdAt: new Date(),
                updatedAt: new Date()
            }));
        
        return records;
    } catch (error) {
        console.error('Error getting attendance by date range:', error);
        return [];
    }
}

// READ - Get today's attendance
export async function getTodayAttendance(): Promise<AttendanceRecord[]> {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        
        return await getAttendanceByDateRange(startOfDay, endOfDay);
    } catch (error) {
        console.error('Error getting today\'s attendance:', error);
        return [];
    }
}

// CREATE - Record attendance (check-in/check-out)
export async function recordAttendance(employeeId: string, type: 'check-in' | 'check-out', notes?: string): Promise<AttendanceRecord | null> {
    try {
        const now = new Date();
        const attendanceId = `ATT_${employeeId}_${now.getTime()}`;
        
        // In a real application, you would save this to your database
        // and potentially sync with the ZK device
        const record: AttendanceRecord = {
            id: attendanceId,
            userSn: parseInt(employeeId),
            deviceUserId: employeeId,
            recordTime: now.toISOString(),
            ip: ZK_CONFIG.ip,
            employeeId,
            employeeName: `Employee ${employeeId}`,
            status: 'present',
            notes,
            createdAt: now,
            updatedAt: now
        };
        
        if (type === 'check-in') {
            record.checkInTime = now;
        } else {
            record.checkOutTime = now;
        }
        
        return record;
    } catch (error) {
        console.error('Error recording attendance:', error);
        return null;
    }
}

// UPDATE - Update attendance record
export async function updateAttendanceRecord(_id: string, _updates: Partial<Omit<AttendanceRecord, 'id' | 'createdAt'>>): Promise<boolean> {
    try {
        // In a real application, you would update in database
        return true;
    } catch (error) {
        console.error('Error updating attendance record:', error);
        return false;
    }
}

// DELETE - Delete attendance record
export async function deleteAttendanceRecord(_id: string): Promise<boolean> {
    try {
        // In a real application, you would delete from database
        return true;
    } catch (error) {
        console.error('Error deleting attendance record:', error);
        return false;
    }
}

// CLEAR - Clear all attendance logs from ZK device
export async function clearAttendanceLogs(): Promise<boolean> {
    try {
        await connect();
        const result = await zkInstance.clearAttendanceLog();
        return result;
    } catch (error) {
        console.error('Error clearing attendance logs:', error);
        return false;
    }
}

// UTILITY FUNCTIONS

// Get attendance summary for an employee
export async function getAttendanceSummary(employeeId: string, startDate: Date, endDate: Date): Promise<AttendanceSummary> {
    try {
        const records = await getAttendanceByEmployee(employeeId, startDate, endDate);
        
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const presentDays = records.length;
        const absentDays = totalDays - presentDays;
        
        const totalWorkHours = records.reduce((total, record) => {
            if (record.checkInTime && record.checkOutTime) {
                const hours = (record.checkOutTime.getTime() - record.checkInTime.getTime()) / (1000 * 60 * 60);
                return total + hours;
            }
            return total;
        }, 0);
        
        const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
        
        return {
            employeeId,
            employeeName: records[0]?.employeeName || `Employee ${employeeId}`,
            totalDays,
            presentDays,
            absentDays,
            lateDays: records.filter(r => r.status === 'late').length,
            earlyLeaveDays: records.filter(r => r.status === 'early-leave').length,
            totalWorkHours,
            totalOvertimeHours: records.reduce((total, record) => total + (record.overtimeHours || 0), 0),
            attendanceRate
        };
    } catch (error) {
        console.error('Error getting attendance summary:', error);
        return {
            employeeId,
            employeeName: `Employee ${employeeId}`,
            totalDays: 0,
            presentDays: 0,
            absentDays: 0,
            lateDays: 0,
            earlyLeaveDays: 0,
            totalWorkHours: 0,
            totalOvertimeHours: 0,
            attendanceRate: 0
        };
    }
}

// Get attendance statistics for all employees
export async function getAttendanceStatistics(startDate: Date, endDate: Date): Promise<{
    totalEmployees: number;
    totalRecords: number;
    averageAttendanceRate: number;
    topPerformers: AttendanceSummary[];
    bottomPerformers: AttendanceSummary[];
}> {
    try {
        const records = await getAttendanceByDateRange(startDate, endDate);
        const uniqueEmployees = [...new Set(records.map(r => r.employeeId))];
        
        const summaries = await Promise.all(
            uniqueEmployees.map(empId => getAttendanceSummary(empId, startDate, endDate))
        );
        
        const averageAttendanceRate = summaries.reduce((sum, summary) => sum + summary.attendanceRate, 0) / summaries.length;
        
        const topPerformers = summaries
            .sort((a, b) => b.attendanceRate - a.attendanceRate)
            .slice(0, 5);
        
        const bottomPerformers = summaries
            .sort((a, b) => a.attendanceRate - b.attendanceRate)
            .slice(0, 5);
        
        return {
            totalEmployees: uniqueEmployees.length,
            totalRecords: records.length,
            averageAttendanceRate,
            topPerformers,
            bottomPerformers
        };
    } catch (error) {
        console.error('Error getting attendance statistics:', error);
        return {
            totalEmployees: 0,
            totalRecords: 0,
            averageAttendanceRate: 0,
            topPerformers: [],
            bottomPerformers: []
        };
    }
}

// Check if employee is currently checked in
export async function isEmployeeCheckedIn(employeeId: string): Promise<boolean> {
    try {
        const todayRecords = await getTodayAttendance();
        const employeeRecords = todayRecords.filter(record => record.employeeId === employeeId);
        
        // Check if there's a check-in without a corresponding check-out
        return employeeRecords.some(record => record.checkInTime && !record.checkOutTime);
    } catch (error) {
        console.error('Error checking if employee is checked in:', error);
        return false;
    }
}

// Get employee's last check-in time
export async function getLastCheckIn(employeeId: string): Promise<Date | null> {
    try {
        const records = await getAttendanceByEmployee(employeeId);
        const checkInRecords = records.filter(record => record.checkInTime);
        
        if (checkInRecords.length === 0) return null;
        
        return new Date(Math.max(...checkInRecords.map(record => record.checkInTime!.getTime())));
    } catch (error) {
        console.error('Error getting last check-in:', error);
        return null;
    }
}

// Get employee's last check-out time
export async function getLastCheckOut(employeeId: string): Promise<Date | null> {
    try {
        const records = await getAttendanceByEmployee(employeeId);
        const checkOutRecords = records.filter(record => record.checkOutTime);
        
        if (checkOutRecords.length === 0) return null;
        
        return new Date(Math.max(...checkOutRecords.map(record => record.checkOutTime!.getTime())));
    } catch (error) {
        console.error('Error getting last check-out:', error);
        return null;
    }
}