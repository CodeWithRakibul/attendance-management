/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'zkteco-js' {
  interface User {
    uid: number;
    userid: string;
    name: string;
    password?: string;
    role?: number;
    cardno?: string;
  }

  export default class Zkteco {
    constructor(ip: string, port: number, inport?: number, timeout?: number);
    createSocket(): Promise<boolean>;
    disconnect(): void;
    getUsers(): Promise<any[]>;
    getAttendances(): Promise<any[]>;
    clearAttendances(): Promise<boolean>;
    clearUsers(): Promise<boolean>;
    setUser(user: User): Promise<boolean>;
    deleteUser(uid: number): Promise<boolean>;
    getDeviceInfo(): Promise<any>;
    getTime(): Promise<Date>;
    setTime(date: Date): Promise<boolean>;
    restart(): Promise<boolean>;
    shutdown(): Promise<boolean>;
    enableDevice(): Promise<boolean>;
    disableDevice(): Promise<boolean>;
    getDeviceStatus(): Promise<any>;
  }
}
