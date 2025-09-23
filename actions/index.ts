// Student Actions
export {
  createStudentAction,
  updateStudentAction,
  deleteStudentAction,
  addStudentNoteAction,
  deleteStudentNoteAction
} from './student'

// Teacher Actions
export {
  createTeacherAction,
  updateTeacherAction,
  deleteTeacherAction,
  createLeaveRequestAction,
  updateLeaveStatusAction,
  deleteLeaveRequestAction
} from './teacher'

// Attendance Actions
export {
  markStudentAttendanceAction,
  markBatchAttendanceAction,
  markStaffAttendanceAction,
  deleteStudentAttendanceAction,
  deleteStaffAttendanceAction
} from './attendance'