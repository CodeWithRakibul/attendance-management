import { connect, zkInstance } from "@/lib/zk/zk"
import type { User } from "@/types/user";
import { BufferConverter } from "@/lib/buffer-utils";

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
export async function createUser(user: User) {
    try {
        await connect();
        //userid, name, password, role = 0, card = 0
        const result = await zkInstance.setUser(user.userId, user.name, user.password, user.role || 0, user.cardno?.toString() || '0');

        // Parse the buffer response if it's a Buffer
        if (Buffer.isBuffer(result)) {
            const parsedResponse = BufferConverter.parseCreateUserResponse(result);

            return {
                success: parsedResponse.success,
                message: parsedResponse.message,
                commandId: parsedResponse.commandId,
                sessionId: parsedResponse.sessionId,
                replyId: parsedResponse.replyId,
                rawHex: parsedResponse.rawHex,
                interpretation: parsedResponse.interpretation,
                user: user // Include the original user data
            };
        }

        // If result is not a Buffer, return as is
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            success: false,
            message: `Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
            user: user
        };
    }
}

// READ - Get all users from ZK device
export async function getUsers() {
    try {
        await connect();

        const result = await zkInstance.getUsers();
        console.log(result);

        // Parse the buffer response if it's a Buffer
        if (Buffer.isBuffer(result)) {
            const parsedResponse = BufferConverter.parseGetUsersResponse(result);

            return {
                success: parsedResponse.success,
                message: parsedResponse.message,
                commandId: parsedResponse.commandId,
                sessionId: parsedResponse.sessionId,
                replyId: parsedResponse.replyId,
                rawHex: parsedResponse.rawHex,
                interpretation: parsedResponse.interpretation,
                users: parsedResponse.users || [],
                userCount: parsedResponse.userCount || 0,
                errorCode: parsedResponse.errorCode
            };
        }

        // If result is not a Buffer, return as is
        return result;
    } catch (error) {
        console.error('Error getting users:', error);
        return {
            success: false,
            message: `Error getting users: ${error instanceof Error ? error.message : 'Unknown error'}`,
            users: [],
            userCount: 0
        };
    }
}

// // READ - Get user by UID
// export async function getUserById(uid: string) {
//     try {
//         const users = await getUsers();
//         // Ensure both uid and user.uid are compared as strings
//         return users.find(user => String(user.uid) === String(uid)) || null;
//     } catch (error) {
//         console.error('Error getting user by ID:', error);
//         return null;
//     }
// }

// UPDATE - Update existing user
export async function updateUser(uid: number, updates: Partial<Omit<User, 'uid'>>) {
    try {
        await connect();

        // Create updated user object
        const updatedUser: User = {
            uid: uid,
            name: updates.name || '',
            password: updates.password || '',
            userId: updates.userId || '',
            role: updates.role || 0,
            cardno: updates.cardno || 0
        };

        const result = await zkInstance.setUser(updatedUser.userId, updatedUser.name, updatedUser.password, updatedUser.role, updatedUser.cardno?.toString() || '0');

        // Parse the buffer response if it's a Buffer
        if (Buffer.isBuffer(result)) {
            const parsedResponse = BufferConverter.parseUpdateUserResponse(result);

            return {
                success: parsedResponse.success,
                message: parsedResponse.message,
                commandId: parsedResponse.commandId,
                sessionId: parsedResponse.sessionId,
                replyId: parsedResponse.replyId,
                rawHex: parsedResponse.rawHex,
                interpretation: parsedResponse.interpretation,
                errorCode: parsedResponse.errorCode,
                updatedUser: updatedUser
            };
        }

        // If result is not a Buffer, return as is
        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            message: `Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
            updatedUser: { uid, ...updates }
        };
    }
}

// DELETE - Delete user from ZK device
export async function deleteUser(uid: number) {
    try {
        await connect();
        const result = await zkInstance.deleteUser(uid);
        console.log({ result });

        // Parse the buffer response if it's a Buffer
        if (Buffer.isBuffer(result)) {
            const parsedResponse = BufferConverter.parseDeleteUserResponse(result);

            return {
                success: parsedResponse.success,
                message: parsedResponse.message,
                commandId: parsedResponse.commandId,
                sessionId: parsedResponse.sessionId,
                replyId: parsedResponse.replyId,
                rawHex: parsedResponse.rawHex,
                interpretation: parsedResponse.interpretation,
                errorCode: parsedResponse.errorCode,
                deletedUid: uid
            };
        }

        // If result is not a Buffer, return as is
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            message: `Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`,
            deletedUid: uid
        };
    }
}

// // BULK OPERATIONS
// export async function createMultipleUsers(users: Omit<User, 'uid'>[]): Promise<{ success: number; failed: number }> {
//     let success = 0;
//     let failed = 0;

//     for (const user of users) {
//         const result = await createUser(user);
//         if (result) {
//             success++;
//         } else {
//             failed++;
//         }
//     }

//     return { success, failed };
// }

// export async function deleteMultipleUsers(uids: string[]): Promise<{ success: number; failed: number }> {
//     let success = 0;
//     let failed = 0;

//     for (const uid of uids) {
//         const result = await deleteUser(uid);
//         if (result) {
//             success++;
//         } else {
//             failed++;
//         }
//     }

//     return { success, failed };
// }

// // UTILITY FUNCTIONS
// export async function getUserCount(): Promise<number> {
//     try {
//         const users = await getUsers();
//         return users.length;
//     } catch (error) {
//         console.error('Error getting user count:', error);
//         return 0;
//     }
// }

// export async function searchUsers(query: string): Promise<User[]> {
//     try {
//         const users = await getUsers();
//         const lowercaseQuery = query.toLowerCase();
//         return users.filter(user =>
//             user.name.toLowerCase().includes(lowercaseQuery)
//         );
//     } catch (error) {
//         console.error('Error searching users:', error);
//         return [];
//     }
// }

// export async function getUsersByRole(role: number): Promise<User[]> {
//     try {
//         const users = await getUsers();
//         return users.filter(user => user.role === role);
//     } catch (error) {
//         console.error('Error getting users by role:', error);
//         return [];
//     }
// }
