/**
 * Comprehensive Buffer Conversion Utilities
 * Shows all the different ways to convert Buffer types in JavaScript/Node.js
 */

// Example Buffer from your ZK device: <Buffer d0 07 99 7b 87 7c 0f 00>
const exampleBuffer = Buffer.from([0xd0, 0x07, 0x99, 0x7b, 0x87, 0x7c, 0x0f, 0x00]);

// Type definitions for ZK device responses
interface ZKUser {
    uid: number;
    role: number;
    name: string;
    userId: string | number;
    password?: string;
    cardno?: number;
}

interface ZKResponse {
    success: boolean;
    message: string;
    commandId: number;
    checkSum: number;
    sessionId: number;
    replyId: number;
    rawHex: string;
    interpretation: string;
    errorCode?: number;
}

interface ZKUserResponse extends ZKResponse {
    users?: ZKUser[];
    userCount?: number;
}

export class BufferConverter {
    /**
     * 1. Convert Buffer to Hex String
     * Most common for debugging and analysis
     */
    static toHex(buffer: Buffer): string {
        return buffer.toString('hex');
        // Example: "d007997b877c0f00"
    }

    /**
     * 2. Convert Buffer to Base64 String
     * Good for data transmission and storage
     */
    static toBase64(buffer: Buffer): string {
        return buffer.toString('base64');
        // Example: "0AeZe3h3DA8A"
    }

    /**
     * 3. Convert Buffer to UTF-8 String
     * Only works if buffer contains valid UTF-8 text
     */
    static toUtf8(buffer: Buffer): string {
        return buffer.toString('utf8');
        // Example: might produce garbled text for binary data
    }

    /**
     * 4. Convert Buffer to ASCII String
     * For ASCII-encoded data
     */
    static toAscii(buffer: Buffer): string {
        return buffer.toString('ascii');
    }

    /**
     * 5. Convert Buffer to Binary String
     * Shows binary representation
     */
    static toBinary(buffer: Buffer): string {
        return buffer.toString('binary');
    }

    /**
     * 6. Convert Buffer to Array of Numbers
     * Useful for processing individual bytes
     */
    static toNumberArray(buffer: Buffer): number[] {
        return Array.from(buffer);
        // Example: [208, 7, 153, 123, 135, 124, 15, 0]
    }

    /**
     * 7. Convert Buffer to Uint8Array
     * Modern JavaScript typed array
     */
    static toUint8Array(buffer: Buffer): Uint8Array {
        return new Uint8Array(buffer);
    }

    /**
     * 8. Convert Buffer to JSON String
     * For serialization
     */
    static toJson(buffer: Buffer): string {
        return JSON.stringify({
            type: 'Buffer',
            data: Array.from(buffer)
        });
    }

    /**
     * 9. Convert Buffer to Object with metadata
     * Comprehensive information about the buffer
     */
    static toObject(buffer: Buffer): {
        length: number;
        hex: string;
        base64: string;
        bytes: number[];
        uint8Array: number[];
    } {
        return {
            length: buffer.length,
            hex: buffer.toString('hex'),
            base64: buffer.toString('base64'),
            bytes: Array.from(buffer),
            uint8Array: Array.from(new Uint8Array(buffer))
        };
    }

    /**
     * 10. Parse Buffer as specific data types
     * For structured binary data
     */
    static parseStructured(buffer: Buffer): {
        firstByte: number;
        secondByte: number;
        remainingBytes: number[];
        asUint16: number;
        asUint32: number;
    } {
        return {
            firstByte: buffer[0],
            secondByte: buffer[1],
            remainingBytes: Array.from(buffer.slice(2)),
            asUint16: buffer.readUInt16BE(0), // Big-endian 16-bit unsigned integer
            asUint32: buffer.readUInt32BE(0)  // Big-endian 32-bit unsigned integer
        };
    }

    /**
     * 11. Convert Buffer to readable format for ZK devices
     * Specific to your ZK device protocol
     */
    static parseZKResponse(buffer: Buffer): {
        success: boolean;
        message: string;
        commandType: number;
        statusCode: number;
        rawHex: string;
        interpretation: string;
    } {
        const hex = buffer.toString('hex');
        const firstByte = buffer[0];
        const secondByte = buffer[1];
        const thirdByte = buffer[2];

        let success = false;
        let message = '';
        let interpretation = '';

        // ZK device specific parsing
        if (firstByte === 0xD0) {
            interpretation = 'Command acknowledgment received';
            if (thirdByte === 0x99) {
                success = true;
                message = 'Operation successful';
            } else {
                success = false;
                message = `Operation failed with status: 0x${thirdByte.toString(16)}`;
            }
        } else {
            interpretation = 'Unknown response format';
            message = 'Unable to interpret response';
        }

        return {
            success,
            message,
            commandType: secondByte,
            statusCode: thirdByte,
            rawHex: hex,
            interpretation
        };
    }

    /**
     * 12. Parse ZK device createUser response specifically
     * Based on the provided ZK protocol documentation
     */
    static parseCreateUserResponse(buffer: Buffer): ZKResponse {
        const hex = buffer.toString('hex');
        
        // Parse the response according to ZK protocol
        // Buffer format: [commandId(2), checksum(2), sessionId(2), replyId(2), ...data]
        const commandId = buffer.readUInt16LE(0);
        const checkSum = buffer.readUInt16LE(2);
        const sessionId = buffer.readUInt16LE(4);
        const replyId = buffer.readUInt16LE(6);

        let success = false;
        let message = '';
        let interpretation = '';
        let errorCode: number | undefined;

        // Based on the provided ZK protocol code, analyze the response
        // Your buffer: <Buffer d0 07 57 7d d6 7a 02 00>
        // d0 07 = commandId (2000 in decimal, 0x07D0 in hex) - CMD_SET_USER
        // 57 7d = checksum
        // d6 7a = sessionId
        // 02 00 = replyId

        if (commandId === 0x07D0) { // CMD_SET_USER
            interpretation = 'Set User command response';
            
            // For ZK devices, a response with just the header (8 bytes) usually indicates success
            // If there's additional data, it might contain error information
            if (buffer.length === 8) {
                success = true;
                message = 'User created successfully';
            } else if (buffer.length > 8) {
                // Check for error codes in additional data
                const errorByte = buffer[8];
                if (errorByte === 0x00) {
                    success = true;
                    message = 'User created successfully';
                } else {
                    success = false;
                    errorCode = errorByte;
                    message = `User creation failed with error code: 0x${errorByte.toString(16)} (${errorByte})`;
                }
            } else {
                success = false;
                message = 'Invalid response length';
            }
        } else if (commandId === 0x07D1) { // CMD_SET_USER_WITH_PASSWORD
            interpretation = 'Set User with Password command response';
            success = buffer.length === 8; // Simple success check
            message = success ? 'User with password created successfully' : 'User creation failed';
        } else {
            interpretation = `Unknown command response: 0x${commandId.toString(16)} (${commandId})`;
            message = 'Unexpected response format';
        }

        return {
            success,
            message,
            commandId,
            checkSum,
            sessionId,
            replyId,
            rawHex: hex,
            interpretation,
            errorCode
        };
    }

    /**
     * 13. Parse ZK device deleteUser response
     * Based on the provided ZK protocol documentation
     */
    static parseDeleteUserResponse(buffer: Buffer): ZKResponse {
        const hex = buffer.toString('hex');
        
        const commandId = buffer.readUInt16LE(0);
        const checkSum = buffer.readUInt16LE(2);
        const sessionId = buffer.readUInt16LE(4);
        const replyId = buffer.readUInt16LE(6);

        let success = false;
        let message = '';
        let interpretation = '';
        let errorCode: number | undefined;

        // CMD_DELETE_USER is typically 0x1380 (based on actual device response)
        if (commandId === 0x1380) {
            interpretation = 'Delete User command response';
            
            if (buffer.length === 8) {
                success = true;
                message = 'User deleted successfully';
            } else if (buffer.length > 8) {
                const errorByte = buffer[8];
                if (errorByte === 0x00) {
                    success = true;
                    message = 'User deleted successfully';
                } else {
                    success = false;
                    errorCode = errorByte;
                    message = `User deletion failed with error code: 0x${errorByte.toString(16)} (${errorByte})`;
                }
            } else {
                success = false;
                message = 'Invalid response length';
            }
        } else {
            interpretation = `Unknown command response: 0x${commandId.toString(16)} (${commandId})`;
            message = 'Unexpected response format';
        }

        return {
            success,
            message,
            commandId,
            checkSum,
            sessionId,
            replyId,
            rawHex: hex,
            interpretation,
            errorCode
        };
    }

    /**
     * 14. Parse ZK device updateUser response
     * Based on the provided ZK protocol documentation
     */
    static parseUpdateUserResponse(buffer: Buffer): ZKResponse {
        const hex = buffer.toString('hex');
        
        const commandId = buffer.readUInt16LE(0);
        const checkSum = buffer.readUInt16LE(2);
        const sessionId = buffer.readUInt16LE(4);
        const replyId = buffer.readUInt16LE(6);

        let success = false;
        let message = '';
        let interpretation = '';
        let errorCode: number | undefined;

        // CMD_EDIT_USER is typically 0x07D3
        if (commandId === 0x07D3) {
            interpretation = 'Update User command response';
            
            if (buffer.length === 8) {
                success = true;
                message = 'User updated successfully';
            } else if (buffer.length > 8) {
                const errorByte = buffer[8];
                if (errorByte === 0x00) {
                    success = true;
                    message = 'User updated successfully';
                } else {
                    success = false;
                    errorCode = errorByte;
                    message = `User update failed with error code: 0x${errorByte.toString(16)} (${errorByte})`;
                }
            } else {
                success = false;
                message = 'Invalid response length';
            }
        } else {
            interpretation = `Unknown command response: 0x${commandId.toString(16)} (${commandId})`;
            message = 'Unexpected response format';
        }

        return {
            success,
            message,
            commandId,
            checkSum,
            sessionId,
            replyId,
            rawHex: hex,
            interpretation,
            errorCode
        };
    }

    /**
     * 15. Parse ZK device getUsers response and decode user data
     * Based on the provided ZK protocol documentation
     */
    static parseGetUsersResponse(buffer: Buffer): ZKUserResponse {
        const hex = buffer.toString('hex');
        
        const commandId = buffer.readUInt16LE(0);
        const checkSum = buffer.readUInt16LE(2);
        const sessionId = buffer.readUInt16LE(4);
        const replyId = buffer.readUInt16LE(6);

        let success = false;
        let message = '';
        let interpretation = '';
        let users: ZKUser[] = [];
        let userCount = 0;
        let errorCode: number | undefined;

        // CMD_USERTEMP_RRQ is typically 0x07D4
        if (commandId === 0x07D4) {
            interpretation = 'Get Users command response';
            
            if (buffer.length > 8) {
                // Parse user data from the response
                const userData = buffer.slice(8);
                users = this.decodeUserDataFromBuffer(userData);
                userCount = users.length;
                success = true;
                message = `Retrieved ${userCount} users successfully`;
            } else if (buffer.length === 8) {
                success = true;
                message = 'No users found on device';
                users = [];
                userCount = 0;
            } else {
                success = false;
                message = 'Invalid response length';
            }
        } else {
            interpretation = `Unknown command response: 0x${commandId.toString(16)} (${commandId})`;
            message = 'Unexpected response format';
        }

        return {
            success,
            message,
            commandId,
            checkSum,
            sessionId,
            replyId,
            rawHex: hex,
            interpretation,
            users,
            userCount,
            errorCode
        };
    }

    /**
     * 16. Decode user data from buffer using ZK protocol
     * Based on the provided ZK protocol documentation
     */
    static decodeUserDataFromBuffer(userData: Buffer): ZKUser[] {
        const users: ZKUser[] = [];
        
        // Try to decode as 28-byte user data format
        if (userData.length % 28 === 0) {
            for (let i = 0; i < userData.length; i += 28) {
                const userBuffer = userData.slice(i, i + 28);
                const user = this.decodeUserData28(userBuffer);
                users.push(user);
            }
        }
        // Try to decode as 72-byte user data format
        else if (userData.length % 72 === 0) {
            for (let i = 0; i < userData.length; i += 72) {
                const userBuffer = userData.slice(i, i + 72);
                const user = this.decodeUserData72(userBuffer);
                users.push(user);
            }
        }
        // If neither format matches, try to parse as raw data
        else {
            // This might be a different format or corrupted data
            console.warn('Unknown user data format, length:', userData.length);
        }

        return users;
    }

    /**
     * 17. Decode 28-byte user data format
     * Based on the provided ZK protocol documentation
     */
    static decodeUserData28(userData: Buffer): ZKUser {
        return {
            uid: userData.readUIntLE(0, 2),
            role: userData.readUIntLE(2, 1),
            name: userData
                .slice(8, 8 + 8)
                .toString('ascii')
                .split('\0')
                .shift() || '',
            userId: userData.readUIntLE(24, 4)
        };
    }

    /**
     * 18. Decode 72-byte user data format
     * Based on the provided ZK protocol documentation
     */
    static decodeUserData72(userData: Buffer): ZKUser {
        return {
            uid: userData.readUIntLE(0, 2),
            role: userData.readUIntLE(2, 1),
            password: userData
                .subarray(3, 3 + 8)
                .toString('ascii')
                .split('\0')
                .shift() || '',
            name: userData
                .slice(11)
                .toString('ascii')
                .split('\0')
                .shift() || '',
            cardno: userData.readUIntLE(35, 4),
            userId: userData
                .slice(48, 48 + 9)
                .toString('ascii')
                .split('\0')
                .shift() || '',
        };
    }

    /**
     * 19. Generic ZK response parser for any operation
     * Based on the provided ZK protocol documentation
     */
    static parseZKOperationResponse(buffer: Buffer, operation: 'create' | 'update' | 'delete' | 'get' | 'unknown' = 'unknown'): ZKResponse | ZKUserResponse {
        switch (operation) {
            case 'create':
                return this.parseCreateUserResponse(buffer);
            case 'update':
                return this.parseUpdateUserResponse(buffer);
            case 'delete':
                return this.parseDeleteUserResponse(buffer);
            case 'get':
                return this.parseGetUsersResponse(buffer);
            default:
                // Try to determine operation from command ID
                const cmdId = buffer.readUInt16LE(0);
                if (cmdId === 0x07D0) return this.parseCreateUserResponse(buffer);
                if (cmdId === 0x07D2) return this.parseDeleteUserResponse(buffer);
                if (cmdId === 0x07D3) return this.parseUpdateUserResponse(buffer);
                if (cmdId === 0x07D4) return this.parseGetUsersResponse(buffer);
                
                // Fallback to generic parsing - return a basic ZKResponse
                const hex = buffer.toString('hex');
                const commandId = buffer.readUInt16LE(0);
                const checkSum = buffer.readUInt16LE(2);
                const sessionId = buffer.readUInt16LE(4);
                const replyId = buffer.readUInt16LE(6);
                
                return {
                    success: false,
                    message: 'Unknown response format',
                    commandId,
                    checkSum,
                    sessionId,
                    replyId,
                    rawHex: hex,
                    interpretation: `Unknown command response: 0x${commandId.toString(16)} (${commandId})`
                };
        }
    }
}

// Example usage function
export function demonstrateBufferConversions() {
    console.log('=== Buffer Conversion Examples ===');
    console.log('Original Buffer:', exampleBuffer);
    console.log('');

    console.log('1. To Hex:', BufferConverter.toHex(exampleBuffer));
    console.log('2. To Base64:', BufferConverter.toBase64(exampleBuffer));
    console.log('3. To Number Array:', BufferConverter.toNumberArray(exampleBuffer));
    console.log('4. To Object:', BufferConverter.toObject(exampleBuffer));
    console.log('5. Structured Parse:', BufferConverter.parseStructured(exampleBuffer));
    console.log('6. ZK Response Parse:', BufferConverter.parseZKResponse(exampleBuffer));
    console.log('');

    // Show individual byte access
    console.log('Individual Bytes:');
    for (let i = 0; i < exampleBuffer.length; i++) {
        console.log(`  Byte ${i}: 0x${exampleBuffer[i].toString(16).padStart(2, '0')} (${exampleBuffer[i]})`);
    }
}

// Export the example buffer for testing
export { exampleBuffer };
