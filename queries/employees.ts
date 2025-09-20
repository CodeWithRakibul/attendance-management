import { connect, ZK_CONFIG, zkInstance } from "@/lib/zk"
import { User } from "./users"

// Employee interface extending User with additional fields
export interface Employee extends User {
    id: string;
    employeeId: string;
    department?: string;
    position?: string;
    email?: string;
    phone?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Department and Position enums for consistency
export enum Department {
    TEACHING = 'Teaching',
    ADMINISTRATION = 'Administration',
    SUPPORT = 'Support',
    MAINTENANCE = 'Maintenance',
    SECURITY = 'Security'
}

export enum Position {
    TEACHER = 'Teacher',
    PRINCIPAL = 'Principal',
    VICE_PRINCIPAL = 'Vice Principal',
    ADMINISTRATOR = 'Administrator',
    SECRETARY = 'Secretary',
    JANITOR = 'Janitor',
    SECURITY_GUARD = 'Security Guard',
    IT_SUPPORT = 'IT Support'
}

// CREATE - Add new employee (teacher/staff)
export async function createEmployee(employeeData: Omit<Employee, 'id' | 'uid' | 'createdAt' | 'updatedAt'>): Promise<Employee | null> {
    try {
        await connect();
        
        const employeeId = `EMP${Date.now()}`;
        const uid = Date.now().toString();
        
        // Create user in ZK device
        const userData: User = {
            uid,
            name: employeeData.name,
            password: employeeData.password,
            role: employeeData.role,
            card: employeeData.card
        };
        
        const userCreated = await zkInstance.setUser(userData);
        if (!userCreated) {
            throw new Error('Failed to create user in ZK device');
        }
        
        // Create employee record
        const employee: Employee = {
            ...employeeData,
            id: employeeId,
            uid,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        return employee;
    } catch (error) {
        console.error('Error creating employee:', error);
        return null;
    }
}

// READ - Get all employees (combines ZK users with employee data)
export async function getEmployees(): Promise<Employee[]> {
    try {
        await connect();
        const users = await zkInstance.getUsers();
        
        // In a real application, you would fetch employee data from a database
        // For now, we'll create employee records from user data
        const employees: Employee[] = users.map((user, index) => ({
            ...user,
            id: `EMP${user.uid}`,
            employeeId: `EMP${user.uid}`,
            department: Department.TEACHING, // Default department
            position: Position.TEACHER, // Default position
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        
        return employees;
    } catch (error) {
        console.error('Error getting employees:', error);
        return [];
    }
}

// READ - Get employee by ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
    try {
        const employees = await getEmployees();
        return employees.find(emp => emp.id === id || emp.employeeId === id) || null;
    } catch (error) {
        console.error('Error getting employee by ID:', error);
        return null;
    }
}

// READ - Get employee by UID
export async function getEmployeeByUid(uid: string): Promise<Employee | null> {
    try {
        const employees = await getEmployees();
        return employees.find(emp => emp.uid === uid) || null;
    } catch (error) {
        console.error('Error getting employee by UID:', error);
        return null;
    }
}

// UPDATE - Update employee information
export async function updateEmployee(id: string, updates: Partial<Omit<Employee, 'id' | 'uid' | 'createdAt'>>): Promise<boolean> {
    try {
        await connect();
        const employee = await getEmployeeById(id);
        if (!employee) {
            throw new Error('Employee not found');
        }
        
        // Update user in ZK device if user data changed
        if (updates.name || updates.password || updates.role || updates.card) {
            const userData: User = {
                uid: employee.uid,
                name: updates.name || employee.name,
                password: updates.password || employee.password,
                role: updates.role || employee.role,
                card: updates.card || employee.card
            };
            
            const userUpdated = await zkInstance.setUser(userData);
            if (!userUpdated) {
                throw new Error('Failed to update user in ZK device');
            }
        }
        
        // Update employee record
        const updatedEmployee: Employee = {
            ...employee,
            ...updates,
            updatedAt: new Date()
        };
        
        // In a real application, you would save to database here
        return true;
    } catch (error) {
        console.error('Error updating employee:', error);
        return false;
    }
}

// DELETE - Delete employee
export async function deleteEmployee(id: string): Promise<boolean> {
    try {
        await connect();
        const employee = await getEmployeeById(id);
        if (!employee) {
            throw new Error('Employee not found');
        }
        
        // Delete user from ZK device
        const userDeleted = await zkInstance.deleteUser(employee.uid);
        if (!userDeleted) {
            throw new Error('Failed to delete user from ZK device');
        }
        
        // In a real application, you would delete from database here
        return true;
    } catch (error) {
        console.error('Error deleting employee:', error);
        return false;
    }
}

// SEARCH AND FILTER FUNCTIONS
export async function searchEmployees(query: string): Promise<Employee[]> {
    try {
        const employees = await getEmployees();
        const lowercaseQuery = query.toLowerCase();
        return employees.filter(emp => 
            emp.name.toLowerCase().includes(lowercaseQuery) ||
            emp.employeeId.toLowerCase().includes(lowercaseQuery) ||
            emp.department?.toLowerCase().includes(lowercaseQuery) ||
            emp.position?.toLowerCase().includes(lowercaseQuery) ||
            emp.email?.toLowerCase().includes(lowercaseQuery)
        );
    } catch (error) {
        console.error('Error searching employees:', error);
        return [];
    }
}

export async function getEmployeesByDepartment(department: Department): Promise<Employee[]> {
    try {
        const employees = await getEmployees();
        return employees.filter(emp => emp.department === department);
    } catch (error) {
        console.error('Error getting employees by department:', error);
        return [];
    }
}

export async function getEmployeesByPosition(position: Position): Promise<Employee[]> {
    try {
        const employees = await getEmployees();
        return employees.filter(emp => emp.position === position);
    } catch (error) {
        console.error('Error getting employees by position:', error);
        return [];
    }
}

export async function getActiveEmployees(): Promise<Employee[]> {
    try {
        const employees = await getEmployees();
        return employees.filter(emp => emp.isActive);
    } catch (error) {
        console.error('Error getting active employees:', error);
        return [];
    }
}

// BULK OPERATIONS
export async function createMultipleEmployees(employeesData: Omit<Employee, 'id' | 'uid' | 'createdAt' | 'updatedAt'>[]): Promise<{ success: number; failed: number; results: Employee[] }> {
    let success = 0;
    let failed = 0;
    const results: Employee[] = [];
    
    for (const empData of employeesData) {
        const result = await createEmployee(empData);
        if (result) {
            success++;
            results.push(result);
        } else {
            failed++;
        }
    }
    
    return { success, failed, results };
}

export async function deleteMultipleEmployees(ids: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    
    for (const id of ids) {
        const result = await deleteEmployee(id);
        if (result) {
            success++;
        } else {
            failed++;
        }
    }
    
    return { success, failed };
}

// UTILITY FUNCTIONS
export async function getEmployeeCount(): Promise<number> {
    try {
        const employees = await getEmployees();
        return employees.length;
    } catch (error) {
        console.error('Error getting employee count:', error);
        return 0;
    }
}

export async function getEmployeeCountByDepartment(): Promise<Record<string, number>> {
    try {
        const employees = await getEmployees();
        const count: Record<string, number> = {};
        
        employees.forEach(emp => {
            const dept = emp.department || 'Unknown';
            count[dept] = (count[dept] || 0) + 1;
        });
        
        return count;
    } catch (error) {
        console.error('Error getting employee count by department:', error);
        return {};
    }
}
