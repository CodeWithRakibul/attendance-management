/**
 * Example usage of the attendance management system CRUD operations
 * This file demonstrates how to use all the implemented functions
 */

import {
    // User management
    createUser, getUsers, getUserById, updateUser, deleteUser, createMultipleUsers, deleteMultipleUsers,
    
    // Employee management
    createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee, searchEmployees,
    getEmployeesByDepartment, getEmployeesByPosition, getActiveEmployees, Department, Position,
    
    // Shift management
    createShift, getShifts, getShiftById, updateShift, deleteShift, assignShiftToEmployee,
    getEmployeeShiftAssignments, generateShiftSchedules, getCurrentShiftForEmployee, isEmployeeOnDuty,
    
    // Attendance management
    getAttendance, getAttendanceByEmployee, getAttendanceByDateRange, getTodayAttendance,
    recordAttendance, updateAttendanceRecord, deleteAttendanceRecord, clearAttendanceLogs,
    getAttendanceSummary, getAttendanceStatistics, isEmployeeCheckedIn, getLastCheckIn, getLastCheckOut,
    
    // Reports
    generateAttendanceSummaryReport, generateEmployeeAttendanceReport, generateDepartmentAttendanceReport,
    generateShiftAnalysisReport, generateOvertimeReport, saveReport, getReports, exportReport,
    ReportType
} from '../queries';

// Example usage functions
export class AttendanceManagementExamples {
    
    // USER MANAGEMENT EXAMPLES
    static async userManagementExamples() {
        console.log('=== USER MANAGEMENT EXAMPLES ===');
        
        // Create a new user
        const newUser = await createUser({
            name: 'John Doe',
            password: '1234',
            role: 0,
            card: '12345'
        });
        console.log('Created user:', newUser);
        
        // Get all users
        const users = await getUsers();
        console.log('All users:', users);
        
        // Get user by ID
        if (users.length > 0) {
            const user = await getUserById(users[0].uid);
            console.log('User by ID:', user);
        }
        
        // Update user
        if (users.length > 0) {
            const updated = await updateUser(users[0].uid, {
                name: 'John Smith',
                role: 1
            });
            console.log('Updated user:', updated);
        }
        
        // Create multiple users
        const multipleUsers = await createMultipleUsers([
            { name: 'Alice Johnson', password: '5678', role: 0 },
            { name: 'Bob Wilson', password: '9012', role: 1 }
        ]);
        console.log('Created multiple users:', multipleUsers);
    }
    
    // EMPLOYEE MANAGEMENT EXAMPLES
    static async employeeManagementExamples() {
        console.log('=== EMPLOYEE MANAGEMENT EXAMPLES ===');
        
        // Create a new employee (teacher)
        const newEmployee = await createEmployee({
            employeeId: 'EMP001',
            name: 'Sarah Teacher',
            password: 'password123',
            role: 0,
            card: '67890',
            department: Department.TEACHING,
            position: Position.TEACHER,
            email: 'sarah.teacher@school.edu',
            phone: '+1234567890',
            isActive: true
        });
        console.log('Created employee:', newEmployee);
        
        // Get all employees
        const employees = await getEmployees();
        console.log('All employees:', employees);
        
        // Search employees
        const searchResults = await searchEmployees('teacher');
        console.log('Search results:', searchResults);
        
        // Get employees by department
        const teachingStaff = await getEmployeesByDepartment(Department.TEACHING);
        console.log('Teaching staff:', teachingStaff);
        
        // Get active employees
        const activeEmployees = await getActiveEmployees();
        console.log('Active employees:', activeEmployees);
    }
    
    // SHIFT MANAGEMENT EXAMPLES
    static async shiftManagementExamples() {
        console.log('=== SHIFT MANAGEMENT EXAMPLES ===');
        
        // Create a new shift
        const newShift = await createShift({
            name: 'Morning Teaching Shift',
            startTime: '08:00',
            endTime: '16:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
            workingDays: [1, 2, 3, 4, 5], // Monday to Friday
            isActive: true,
            description: 'Standard teaching shift'
        });
        console.log('Created shift:', newShift);
        
        // Get all shifts
        const shifts = await getShifts();
        console.log('All shifts:', shifts);
        
        // Assign shift to employee
        if (shifts.length > 0) {
            const assignment = await assignShiftToEmployee({
                employeeId: 'EMP001',
                shiftId: shifts[0].id,
                startDate: new Date(),
                isActive: true
            });
            console.log('Shift assignment:', assignment);
        }
        
        // Generate shift schedules for next week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const schedules = await generateShiftSchedules(new Date(), nextWeek);
        console.log('Generated schedules:', schedules);
        
        // Check if employee is on duty
        const onDuty = await isEmployeeOnDuty('EMP001');
        console.log('Employee on duty:', onDuty);
    }
    
    // ATTENDANCE MANAGEMENT EXAMPLES
    static async attendanceManagementExamples() {
        console.log('=== ATTENDANCE MANAGEMENT EXAMPLES ===');
        
        // Get all attendance records
        const allAttendance = await getAttendance();
        console.log('All attendance records:', allAttendance);
        
        // Get today's attendance
        const todayAttendance = await getTodayAttendance();
        console.log('Today\'s attendance:', todayAttendance);
        
        // Record check-in
        const checkIn = await recordAttendance('EMP001', 'check-in', 'Morning check-in');
        console.log('Check-in recorded:', checkIn);
        
        // Record check-out
        const checkOut = await recordAttendance('EMP001', 'check-out', 'End of day');
        console.log('Check-out recorded:', checkOut);
        
        // Get attendance by employee for last month
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const employeeAttendance = await getAttendanceByEmployee('EMP001', lastMonth, new Date());
        console.log('Employee attendance (last month):', employeeAttendance);
        
        // Get attendance summary
        const summary = await getAttendanceSummary('EMP001', lastMonth, new Date());
        console.log('Attendance summary:', summary);
        
        // Check if employee is currently checked in
        const isCheckedIn = await isEmployeeCheckedIn('EMP001');
        console.log('Is employee checked in:', isCheckedIn);
        
        // Get last check-in time
        const lastCheckIn = await getLastCheckIn('EMP001');
        console.log('Last check-in:', lastCheckIn);
    }
    
    // REPORTS EXAMPLES
    static async reportsExamples() {
        console.log('=== REPORTS EXAMPLES ===');
        
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        // Generate attendance summary report
        const summaryReport = await generateAttendanceSummaryReport({
            startDate: lastMonth,
            endDate: new Date(),
            format: 'json'
        });
        console.log('Attendance summary report:', summaryReport);
        
        // Generate employee attendance report
        const employeeReport = await generateEmployeeAttendanceReport('EMP001', {
            startDate: lastMonth,
            endDate: new Date(),
            format: 'json'
        });
        console.log('Employee attendance report:', employeeReport);
        
        // Generate department attendance report
        const departmentReport = await generateDepartmentAttendanceReport('Teaching', {
            startDate: lastMonth,
            endDate: new Date(),
            format: 'json'
        });
        console.log('Department attendance report:', departmentReport);
        
        // Generate overtime report
        const overtimeReport = await generateOvertimeReport({
            startDate: lastMonth,
            endDate: new Date(),
            format: 'json'
        });
        console.log('Overtime report:', overtimeReport);
        
        // Save report
        const savedReport = await saveReport({
            title: 'Monthly Attendance Report',
            type: ReportType.MONTHLY_REPORT,
            description: 'Comprehensive monthly attendance analysis',
            parameters: {
                startDate: lastMonth,
                endDate: new Date(),
                format: 'json'
            },
            data: summaryReport,
            generatedAt: new Date(),
            generatedBy: 'system',
            status: 'completed'
        });
        console.log('Saved report:', savedReport);
        
        // Export report
        if (savedReport.id) {
            const exportedData = await exportReport(savedReport.id, 'csv');
            console.log('Exported report (CSV):', exportedData);
        }
    }
    
    // COMPREHENSIVE EXAMPLE - Complete workflow
    static async completeWorkflowExample() {
        console.log('=== COMPLETE WORKFLOW EXAMPLE ===');
        
        try {
            // 1. Create employee
            const employee = await createEmployee({
                employeeId: 'EMP999',
                name: 'Test Teacher',
                password: 'test123',
                role: 0,
                department: Department.TEACHING,
                position: Position.TEACHER,
                email: 'test@school.edu',
                isActive: true
            });
            console.log('1. Created employee:', employee?.employeeId);
            
            // 2. Create shift
            const shift = await createShift({
                name: 'Test Shift',
                startTime: '09:00',
                endTime: '17:00',
                workingDays: [1, 2, 3, 4, 5],
                isActive: true
            });
            console.log('2. Created shift:', shift?.id);
            
            // 3. Assign shift to employee
            if (employee && shift) {
                const assignment = await assignShiftToEmployee({
                    employeeId: employee.employeeId,
                    shiftId: shift.id,
                    startDate: new Date(),
                    isActive: true
                });
                console.log('3. Assigned shift:', assignment?.id);
            }
            
            // 4. Record attendance
            if (employee) {
                const checkIn = await recordAttendance(employee.employeeId, 'check-in');
                console.log('4. Recorded check-in:', checkIn?.id);
                
                // Simulate work day
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const checkOut = await recordAttendance(employee.employeeId, 'check-out');
                console.log('5. Recorded check-out:', checkOut?.id);
            }
            
            // 5. Generate report
            const report = await generateEmployeeAttendanceReport('EMP999', {
                startDate: new Date(),
                endDate: new Date(),
                format: 'json'
            });
            console.log('6. Generated report:', report.reportId);
            
            console.log('Complete workflow executed successfully!');
            
        } catch (error) {
            console.error('Error in complete workflow:', error);
        }
    }
    
    // Run all examples
    static async runAllExamples() {
        console.log('Starting Attendance Management System Examples...\n');
        
        try {
            await this.userManagementExamples();
            console.log('\n');
            
            await this.employeeManagementExamples();
            console.log('\n');
            
            await this.shiftManagementExamples();
            console.log('\n');
            
            await this.attendanceManagementExamples();
            console.log('\n');
            
            await this.reportsExamples();
            console.log('\n');
            
            await this.completeWorkflowExample();
            
            console.log('\nAll examples completed successfully!');
            
        } catch (error) {
            console.error('Error running examples:', error);
        }
    }
}

// Export for use in other files
export default AttendanceManagementExamples;
