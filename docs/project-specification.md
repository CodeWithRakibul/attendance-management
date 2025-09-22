# 🏫 Coaching Management System – Project Specification

This document describes the **full requirements**, **data model**, and **MVP scope** of the Coaching Management System.  
The implementation is based on **Next.js (App Router)**, **Server Actions**, and **shadcn/ui** with theming conventions.

---

# 1. 📌 Full Requirements

### Session Management

-   Annual sessions (2025, 2026, 2027…)
-   Session auto-close → lock all related data
-   New session = fresh setup for class, section, roll, fees

### Student Information

-   Admission
-   Student profile (attractive UI)
-   Student categories (color-coded)
-   Active/Inactive/Disabled status
-   Disable reason
-   Staff-only Notes/Diary
-   Continuity tick (for next session admission)
-   Delete student

### Fee Collection

-   Collect by Student ID or batch
-   Fee master, fee group, fee type
-   Discounts
-   Pending approval workflow → Admin approves → Receipt generated

### Income & Expense

-   Add income, add expense
-   Daily total income/expense
-   Reports: monthly, yearly balance

### Examination

-   Exam group & schedule
-   Exam categories
-   Marks entry & ranking
-   Student categories with hidden behavioral notes
-   Result processing & continuity selection

### Attendance

-   Student attendance by date
-   Teacher/staff attendance
-   Daily summary & monthly reports

### Academic

-   Batch time setting
-   Teacher time setting
-   Holiday calendar
-   Assign class teacher
-   Subject, class, batch, section, roll management

### Teacher / Staff

-   Staff directory
-   Staff attendance
-   Leave apply & approve
-   Leave type
-   Designation
-   Disable staff
-   Assign subject
-   Increment report
-   Teacher dashboard with class plan, tests, notices

### Communication

-   Notice board
-   SMS (all students, absentees, low scorers, staff, subject teachers)
-   Due list SMS
-   SMS history
-   SMS purchase
-   SMS templates

### Website Activities

-   Events
-   Gallery
-   News

### Routine Management

-   Admin creates routine template
-   Teachers submit routine
-   View class routine (by school/class/subject)

### Payroll

-   Salary setup
-   Advance salary
-   Salary report

### Office Operations

-   Assigned school responsibilities
-   School-wise syllabus
-   Notes repository
-   Question papers
-   Class test creation
-   Model test creation
-   Class plan creation

### Reports

-   Student info reports (gender ratio, guardian list, admission trends)
-   Finance reports (daily collection, income/expense, dues, yearly balance, payroll)
-   Attendance reports (daily, monthly, staff)
-   Exam reports (schedule, ranking, marks, results)
-   User logs
-   Monthly report cards (attendance, fees, tests, remarks, print/export)
-   SMS reports

---

# 2. 🎯 MVP Scope

For the first release (MVP), focus on:

1. **Dashboard**

    - Summary cards (Total students, Active teachers, Pending fees, Today’s attendance)
    - Charts: admission trends, collection vs expense, attendance %
    - Notifications (due alerts, notes)

2. **Students**

    - CRUD (Add, Edit, Delete, View)
    - Profile with tabs (Overview | Guardian | Attendance | Fees | Notes)
    - Notes (staff-only)
    - Search by class, batch, session

3. **Teachers**

    - CRUD (Add, Edit, Disable, View)
    - Profile (subjects, salary, leaves, dashboard info)
    - Leave management (apply & approve)

4. **Attendance**

    - Student attendance (by batch, by date)
    - Staff attendance
    - Reports (daily summary, monthly %)

5. **Reports**
    - Student reports (guardian list, gender ratio)
    - Attendance reports (daily/monthly)
    - Finance reports (daily collection, pending dues)
    - Export/Print (PDF/Excel)

---

# 3. 📂 Data Model

### Session

-   `id`, `year`, `status (active/closed)`
-   `createdAt`, `updatedAt`

### Student

-   `id`, `studentId`, `sessionId`
-   `classId`, `batchId`, `sectionId`, `roll`
-   `personal` { nameBn, nameEn, dob, gender, bloodGroup, photoUrl }
-   `guardian` { fatherName, motherName, occupations, contact { smsNo, altNo, email } }
-   `address` { present, permanent }
-   `status (active/inactive/disabled)`
-   `disableReason`
-   `notes[]` { staffId, note, createdAt }
-   `continuityTick` (bool)
-   `createdAt`, `updatedAt`

### Teacher / Staff

-   `id`, `staffId`, `sessionId`
-   `personal` { nameBn, nameEn, dob, gender, bloodGroup }
-   `contact` { mobile, email, facebook }
-   `address` { present, permanent }
-   `designation`
-   `subjects[]`
-   `qualification`, `experience`
-   `salaryInfo` { basicSalary, allowances{}, advanceTaken }
-   `status`
-   `incrementHistory[]`
-   `leaveInfo[]`
-   `dashboard` { attendanceSummary, classTestsTaken }
-   `createdAt`, `updatedAt`

### Attendance

-   Student: { id, studentId, sessionId, batchId, date, status, markedBy }
-   Staff: { id, staffId, date, status }

### Fees & Collections

-   FeeMaster: { id, sessionId, name, amount, type, groupId, dueDate }
-   Collection: { id, studentId, sessionId, amount, method, status, collectedBy, receiptNo }

---

# 4. 🔗 Relationships

```mermaid
erDiagram
  Session ||--o{ Student : "has"
  Session ||--o{ Teacher : "has"
  Session ||--o{ FeeMaster : "defines"
  Student ||--o{ Collection : "pays"
  Student ||--o{ AttendanceStudent : "marks"
  Teacher ||--o{ AttendanceStaff : "marks"
```
