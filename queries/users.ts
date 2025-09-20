import { connect, ZK_CONFIG, zkInstance } from "@/lib/zk"

// User interface based on zklib-js types
export interface User {
    uid: string;
    name: string;
    password?: string;
    role?: number;
    card?: string;
}

// Extended user interface for our application
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

// CREATE - Add new user to ZK device
export async function createUser(user: Omit<User, 'uid'>): Promise<boolean> {
    try {
        await connect();
        const newUser: User = {
            uid: Date.now().toString(), // Generate unique ID
            ...user
        };
        const result = await zkInstance.setUser(newUser);
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        return false;
    }
}

// READ - Get all users from ZK device
export async function getUsers(): Promise<User[]> {
    try {
        await connect();
        const users = await zkInstance.getUsers();
        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

// READ - Get user by UID
export async function getUserById(uid: string): Promise<User | null> {
    try {
        const users = await getUsers();
        return users.find(user => user.uid === uid) || null;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}

// UPDATE - Update existing user
export async function updateUser(uid: string, updates: Partial<Omit<User, 'uid'>>): Promise<boolean> {
    try {
        await connect();
        const existingUser = await getUserById(uid);
        if (!existingUser) {
            throw new Error('User not found');
        }
        
        const updatedUser: User = {
            ...existingUser,
            ...updates
        };
        
        const result = await zkInstance.setUser(updatedUser);
        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        return false;
    }
}

// DELETE - Delete user from ZK device
export async function deleteUser(uid: string): Promise<boolean> {
    try {
        await connect();
        const result = await zkInstance.deleteUser(uid);
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        return false;
    }
}

// BULK OPERATIONS
export async function createMultipleUsers(users: Omit<User, 'uid'>[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    
    for (const user of users) {
        const result = await createUser(user);
        if (result) {
            success++;
        } else {
            failed++;
        }
    }
    
    return { success, failed };
}

export async function deleteMultipleUsers(uids: string[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    
    for (const uid of uids) {
        const result = await deleteUser(uid);
        if (result) {
            success++;
        } else {
            failed++;
        }
    }
    
    return { success, failed };
}

// UTILITY FUNCTIONS
export async function getUserCount(): Promise<number> {
    try {
        const users = await getUsers();
        return users.length;
    } catch (error) {
        console.error('Error getting user count:', error);
        return 0;
    }
}

export async function searchUsers(query: string): Promise<User[]> {
    try {
        const users = await getUsers();
        const lowercaseQuery = query.toLowerCase();
        return users.filter(user => 
            user.name.toLowerCase().includes(lowercaseQuery) ||
            user.uid.includes(query) ||
            (user.card && user.card.includes(query))
        );
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
}

export async function getUsersByRole(role: number): Promise<User[]> {
    try {
        const users = await getUsers();
        return users.filter(user => user.role === role);
    } catch (error) {
        console.error('Error getting users by role:', error);
        return [];
    }
}
