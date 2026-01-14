# Smart Coaching Management System - Project Structure & Requirements

## 1. System Overview
**Project Name:** Smart Coaching Management System (Web & Mobile App)
**Goal:** A comprehensive solution for coaching center management, including a Web Admin Panel for office staff and a Mobile App for teachers, parents, and students.

### User Roles
1.  **Super Admin:** Owner (Full Access).
2.  **Admin/Office Staff:** Data Entry & Collection.
3.  **Teacher:** Attendance, Marks Entry, Script Checking Bill.
4.  **Student/Parent:** Reports, Payment History, Notices.

## 2. Modules & Functionality

### Module 1: Session & Configuration (Core Settings)
*   **Dynamic Session Management:** Create new sessions (e.g., 2025, 2026).
*   **Auto Archive:** Old session data (classes, sections) archived; Student Profiles remain, mapped to new classes.
*   **Feature Reset:** Wizard to setup classes and fee structures for new sessions.

### Module 2: Student Information System (SIS)
*   **Admission Form:** Detailed info, photo, 'Continuity Checkbox' for next year booking.
*   **Smart Profiling:** Color-coded profiles based on guardian's income/occupation (Admin defined).
*   **Secret Notes:** Hidden notes for teachers/staff (Behavior, Discipline) invisible to parents.
*   **Categories:** Regular, Scholarship, Weak Learner tags.
*   **Disable/Delete:** Inactive status and archival.

### Module 3: Accounts & Fees Management (Advanced)
*   **Maker-Checker Policy:** Staff collects money -> Status "Pending" -> Admin approves -> Status "Paid".
*   **Automated Receipt:** Auto-invoice generation (SMS/Email).
*   **Due Tracking:** Search by batch/ID for due list. Auto-reminder.
*   **Income-Expense Dashboard:** Daily Collection vs Expense. Net Profit Calculation.

### Module 4: Academic & Routine
*   **Routine Architecture:** Admin defines structure (Slot, Room, Time); Teachers submit requests.
*   **Batch Management:** Shift, Section, Batch, Subject mapping.
*   **Holiday Calendar:** Mark holidays -> Auto notification & Attendance disabled.

### Module 5: Exam & Result (Exam Module)
*   **Exam Setup:** Class Test, Model Test, Quiz.
*   **Marks Entry:** Via App or Excel Upload.
*   **Ranking System:** Auto Merit List (Highest to Lowest).
*   **Progress Report:** Average of multiple exams, Graphical Chart.

### Module 6: HR & Payroll (Unique Feature)
*   **Dynamic Salary:** Basic + Increment.
*   **Script Checking Bill:** Teacher inputs quantity -> Admin approves -> Added to Salary.
*   **Advance Salary:** Deduction from salary sheet.
*   **Staff Attendance:** Biometric/Geo-fencing.

### Module 7: Communication & Smart Diary
*   **Automated Report Card:** Monthly PDF (Attendance %, Marks, Payment Status, Teacher Feedback).
*   **SMS Gateway:** Bulk & Custom SMS.
*   **Complaint Box:** Parent complaints -> Admin Popup.

### Module 8: Website & App Content (CMS)
*   **CMS:** Manage Notice, News, Gallery from Admin Panel -> Updates Web & App.

## 3. Technical Specification
*   **Backend:** Node.js (Next.js API Routes) / Python (Django/FastAPI). *Current: Next.js + Prisma + MongoDB*
*   **Database:** PostgreSQL / MongoDB. *Current: MongoDB*
*   **Frontend (Web Admin):** React.js (Next.js).
*   **Mobile App:** Flutter (Android & iOS).

## 4. Current Project Structure (Mapped)
The project currently uses **Next.js** with **Prisma** and **MongoDB**.

### Database Schema Mapping (Prisma)
*   **Session:** `Session` model exists.
*   **Student:** `Student` model exists. `personal`, `guardian`, `address` stored as JSON.
*   **Teacher:** `Teacher` model exists. `salaryInfo` stored as JSON.
*   **Attendance:** `AttendanceStudent`, `AttendanceStaff` models exist.
*   **Fees:** `FeeMaster`, `Collection` models exist. `Collection` has `status` for Maker-Checker.
*   **Exam:** *Missing dedicated models.*
*   **Routine:** *Basic `timeSlot` in `Batch`, needs expansion.*
*   **CMS:** *Missing models.*

## 5. Development Roadmap

### Phase 1: Core (Current Focus)
*   Student Admission, Batch Setup.
*   Fees Collection (Pending/Approve logic).

### Phase 2: Academic
*   Attendance.
*   Exam Result & Report Card.

### Phase 3: HR & App
*   Payroll (Salary, Script Bills).
*   Mobile App Launch (Flutter).

### Phase 4: Web
*   Website & Advanced Reports.
