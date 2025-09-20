declare module 'zklib-js' {
    interface User {
        uid: string;
        name: string;
        password?: string;
        role?: number;
        card?: string;
    }

    interface Attendance {
        userSn: number;
        deviceUserId: string;
        recordTime: string;
        ip: string;
    }

    interface DeviceInfo {
        serialNumber: string;
        deviceName: string;
        firmwareVersion: string;
        platform: string;
        fingerprintAlgorithm: string;
        faceAlgorithm: string;
    }

    class ZKLib {
        constructor(ip: string, port: number, inport?: number, timeout?: number);
        createSocket(): Promise<boolean>;
        disconnect(): Promise<boolean>;
        getUsers(): Promise<User[]>;
        getAttendances(): Promise<Attendance[]>;
        clearAttendanceLog(): Promise<boolean>;
        clearData(): Promise<boolean>;
        clearUserData(): Promise<boolean>;
        setUser(user: User): Promise<boolean>;
        deleteUser(uid: string): Promise<boolean>;
        enableDevice(): Promise<boolean>;
        disableDevice(): Promise<boolean>;
        getInfo(): Promise<DeviceInfo>;
        getTime(): Promise<Date>;
        setTime(date: Date): Promise<boolean>;
        getRealTimeEvents(callback: (data: Attendance) => void): void;
        clearRealTimeEvents(): void;
    }

    export = ZKLib;
}
