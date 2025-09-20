import { getAttendanceWithCallback } from "@/queries/attendance";

export default async function Home() {
  // const attendance = await getTeacherAttendance();
  const logs = await getAttendanceWithCallback();

  // console.log(attendance);
  console.log(logs );
  // console.log(users);
  // console.log(info);

  return (
    <div>

    </div>
  );
}
