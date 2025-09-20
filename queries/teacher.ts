import { zkInstance, connect } from '@/lib/zk';

export async function getTeacherAttendance() {
    await connect();
    const attendance = await zkInstance.getAttendances();
    return attendance;
}

export async function getTeacherUsers() {
    await connect();
    const users = await zkInstance.getUsers();
    return users;
}

export async function getTeacherInfo() {
    await connect();
    const info = await zkInstance.getInfo();
    return info;
}

export async function getRealTimeEvents() {
    await connect();
    const events = await zkInstance.getRealTimeEvents((_data) => {
        // console.log(data);
    });
    return events;
}