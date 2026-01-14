'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Common interfaces
interface ReportFilters {
  sessionId?: string;
  classId?: string;
  batchId?: string;
  sectionId?: string;
  dateFrom?: string;
  dateTo?: string;
  month?: string;
  year?: string;
  status?: string;
  gender?: string;
  reportType?: string;
  attendanceType?: string;
  feeType?: string;
  paymentStatus?: string;
}

// Session, Class, Batch helpers
export async function getSessions() {
  try {
    return await prisma.session.findMany({
      orderBy: { year: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

export async function getClasses(sessionId?: string) {
  try {
    const where = sessionId && sessionId !== 'ALL_SESSIONS' ? { sessionId } : {};
    return await prisma.class.findMany({
      where,
      include: { session: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
}

export async function getBatches(classId?: string) {
  try {
    const where = classId && classId !== 'ALL_CLASSES' ? { classId } : {};
    return await prisma.batch.findMany({
      where,
      include: { class: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return [];
  }
}

export async function getSections(classId?: string) {
  try {
    const where = classId && classId !== 'ALL_CLASSES' ? { classId } : {};
    return await prisma.section.findMany({
      where,
      include: { class: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
}

// Student Reports
export async function getStudentReportData(filters: ReportFilters) {
  try {
    const where: any = {};
    
    if (filters.sessionId && filters.sessionId !== 'ALL_SESSIONS') where.sessionId = filters.sessionId;
    if (filters.classId && filters.classId !== 'ALL_CLASSES') where.classId = filters.classId;
    if (filters.batchId && filters.batchId !== 'ALL_BATCHES') where.batchId = filters.batchId;
    if (filters.sectionId && filters.sectionId !== 'ALL_SECTIONS') where.sectionId = filters.sectionId;
    if (filters.status && filters.status !== 'NONE') where.status = filters.status;
    if (filters.gender && filters.gender !== 'ALL') where['personal.gender'] = filters.gender;

    const students = await prisma.student.findMany({
      where,
      include: {
        session: true,
        class: true,
        batch: true,
        section: true,
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        collections: {
          include: { feeMaster: true },
        },
      },
      orderBy: { studentId: 'asc' },
    });

    // Generate summary statistics
    const summary = {
      totalStudents: students.length,
      maleStudents: students.filter(s => (s.personal as any)?.gender === 'MALE').length,
      femaleStudents: students.filter(s => (s.personal as any)?.gender === 'FEMALE').length,
      activeStudents: students.filter(s => s.status === 'ACTIVE').length,
      inactiveStudents: students.filter(s => s.status === 'INACTIVE').length,
      averageAge: 0,
    };

    // Calculate average age
    const ages = students
      .filter(s => (s.personal as any)?.dateOfBirth)
      .map(s => {
        const personal = s.personal as any;
        const birthDate = new Date(personal.dateOfBirth);
        const today = new Date();
        return today.getFullYear() - birthDate.getFullYear();
      });
    
    summary.averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

    // Class distribution
    const classDistribution = students.reduce((acc: any, student) => {
      const studentWithRelations = student as any;
      const className = studentWithRelations.class?.name || 'Unknown';
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {});

    // Gender distribution by class
    const genderByClass = students.reduce((acc: any, student) => {
      const studentWithRelations = student as any;
      const className = studentWithRelations.class?.name || 'Unknown';
      const personal = student.personal as any;
      const gender = personal?.gender || 'UNKNOWN';
      
      if (!acc[className]) {
        acc[className] = { MALE: 0, FEMALE: 0, UNKNOWN: 0 };
      }
      acc[className][gender]++;
      return acc;
    }, {});

    // Guardian contact summary
    const guardianContacts = students.map(student => {
      const personal = student.personal as any;
      const guardian = student.guardian as any;
      return {
        studentId: student.studentId,
        studentName: personal?.nameEn,
        guardianName: guardian?.fatherName,
        guardianMobile: guardian?.contact?.smsNo,
        guardianEmail: guardian?.contact?.email,
        relationship: 'Father',
        address: student.address,
      };
    });

    return {
      students,
      summary,
      classDistribution,
      genderByClass,
      guardianContacts,
    };
  } catch (error) {
    console.error('Error generating student report:', error);
    throw new Error('Failed to generate student report');
  }
}

// Attendance Reports
export async function getAttendanceReportData(filters: ReportFilters) {
  try {
    const dateFilter: any = {};
    if (filters.dateFrom && filters.dateTo) {
      dateFilter.date = {
        gte: new Date(filters.dateFrom),
        lte: new Date(filters.dateTo),
      };
    } else if (filters.month && filters.year) {
      const startDate = new Date(parseInt(filters.year), parseInt(filters.month) - 1, 1);
      const endDate = new Date(parseInt(filters.year), parseInt(filters.month), 0);
      dateFilter.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Student Attendance
    const studentAttendances = await prisma.attendanceStudent.findMany({
      where: {
        ...dateFilter,
        student: {
          sessionId: (filters.sessionId && filters.sessionId !== 'ALL_SESSIONS') ? filters.sessionId : undefined,
          classId: (filters.classId && filters.classId !== 'ALL_CLASSES') ? filters.classId : undefined,
          batchId: (filters.batchId && filters.batchId !== 'ALL_BATCHES') ? filters.batchId : undefined,
          sectionId: (filters.sectionId && filters.sectionId !== 'ALL_SECTIONS') ? filters.sectionId : undefined,
        },
      },
      include: {
        student: {
          include: {
            class: true,
            batch: true,
            section: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    // Staff Attendance
    const staffAttendances = await prisma.attendanceStaff.findMany({
      where: dateFilter,
      include: {
        staff: true,
      },
      orderBy: { date: 'desc' },
    });

    // Calculate student attendance summary
    const studentSummary = {
      totalRecords: studentAttendances.length,
      presentCount: studentAttendances.filter(a => a.status === 'PRESENT').length,
      absentCount: studentAttendances.filter(a => a.status === 'ABSENT').length,
      lateCount: studentAttendances.filter(a => a.status === 'LATE').length,
      attendancePercentage: 0,
    };

    if (studentSummary.totalRecords > 0) {
      studentSummary.attendancePercentage = Math.round(
        (studentSummary.presentCount / studentSummary.totalRecords) * 100
      );
    }

    // Calculate staff attendance summary
    const staffSummary = {
      totalRecords: staffAttendances.length,
      presentCount: staffAttendances.filter(a => a.status === 'PRESENT').length,
      absentCount: staffAttendances.filter(a => a.status === 'ABSENT').length,
      leaveCount: staffAttendances.filter(a => a.status === 'LEAVE').length,
      attendancePercentage: 0,
    };

    if (staffSummary.totalRecords > 0) {
      staffSummary.attendancePercentage = Math.round(
        (staffSummary.presentCount / staffSummary.totalRecords) * 100
      );
    }

    // Daily attendance trends
    const dailyTrends = studentAttendances.reduce((acc: any, attendance) => {
      const dateKey = attendance.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, present: 0, absent: 0, late: 0, total: 0 };
      }
      acc[dateKey][attendance.status.toLowerCase()]++;
      acc[dateKey].total++;
      return acc;
    }, {});

    // Class-wise attendance
    const classWiseAttendance = studentAttendances.reduce((acc: any, attendance) => {
      const className = attendance.student?.class?.name || 'Unknown';
      if (!acc[className]) {
        acc[className] = { present: 0, absent: 0, late: 0, total: 0 };
      }
      acc[className][attendance.status.toLowerCase()]++;
      acc[className].total++;
      return acc;
    }, {});

    // Calculate class-wise percentages
    Object.keys(classWiseAttendance).forEach(className => {
      const data = classWiseAttendance[className];
      data.attendancePercentage = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
    });

    return {
      studentAttendances,
      staffAttendances,
      studentSummary,
      staffSummary,
      dailyTrends: Object.values(dailyTrends),
      classWiseAttendance,
    };
  } catch (error) {
    console.error('Error generating attendance report:', error);
    throw new Error('Failed to generate attendance report');
  }
}

// Finance Reports
export async function getFinanceReportData(filters: ReportFilters) {
  try {
    const dateFilter: any = {};
    if (filters.dateFrom && filters.dateTo) {
      dateFilter.collectedAt = {
        gte: new Date(filters.dateFrom),
        lte: new Date(filters.dateTo),
      };
    } else if (filters.month && filters.year) {
      const startDate = new Date(parseInt(filters.year), parseInt(filters.month) - 1, 1);
      const endDate = new Date(parseInt(filters.year), parseInt(filters.month), 0);
      dateFilter.collectedAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const where: any = { ...dateFilter };
    if (filters.paymentStatus && filters.paymentStatus !== 'ALL') where.status = filters.paymentStatus;
    if (filters.sessionId || filters.classId || filters.batchId) {
      where.student = {};
      if (filters.sessionId && filters.sessionId !== 'ALL_SESSIONS') where.student.sessionId = filters.sessionId;
      if (filters.classId && filters.classId !== 'ALL_CLASSES') where.student.classId = filters.classId;
      if (filters.batchId && filters.batchId !== 'ALL_BATCHES') where.student.batchId = filters.batchId;
    }
    if (filters.feeType && filters.feeType !== 'ALL') {
      where.feeMaster = { type: filters.feeType };
    }

    // Get collections
    const collections = await prisma.collection.findMany({
      where,
      include: {
        student: {
          include: {
            class: true,
            batch: true,
            section: true,
          },
        },
        feeMaster: true,
      },
      orderBy: { collectedAt: 'desc' },
    });

    // Calculate summary
    const summary = {
      totalCollection: collections
        .filter(c => c.status === 'APPROVED')
        .reduce((sum, c) => sum + (c.amount || 0), 0),
      totalDues: collections
        .filter(c => c.status === 'PENDING')
        .reduce((sum, c) => sum + (c.amount || 0), 0),
      totalExpense: 0, // This would come from an expense tracking system
      netProfit: 0,
    };

    summary.netProfit = summary.totalCollection - summary.totalExpense;

    // Fee type distribution
    const feeTypeDistribution = collections.reduce((acc: any, collection) => {
      const feeType = collection.feeMaster?.type || 'OTHER';
      if (!acc[feeType]) {
        acc[feeType] = { feeType, amount: 0, count: 0 };
      }
      if (collection.status === 'APPROVED') {
        acc[feeType].amount += collection.amount || 0;
        acc[feeType].count++;
      }
      return acc;
    }, {});

    // Calculate percentages
    const totalFeeAmount = Object.values(feeTypeDistribution).reduce((sum: number, item: any) => sum + item.amount, 0);
    Object.values(feeTypeDistribution).forEach((item: any) => {
      item.percentage = totalFeeAmount > 0 ? Math.round((item.amount / totalFeeAmount) * 100) : 0;
    });

    // Class-wise collection summary
    const classSummary = collections.reduce((acc: any, collection) => {
      const className = collection.student?.class?.name || 'Unknown';
      if (!acc[className]) {
        acc[className] = {
          className,
          totalStudents: 0,
          totalCollection: 0,
          pendingDues: 0,
          collectionPercentage: 0,
        };
      }
      
      if (collection.status === 'APPROVED') {
        acc[className].totalCollection += collection.amount || 0;
      } else if (collection.status === 'PENDING') {
        acc[className].pendingDues += collection.amount || 0;
      }
      
      return acc;
    }, {});

    // Calculate collection percentages for each class
    Object.values(classSummary).forEach((summary: any) => {
      const total = summary.totalCollection + summary.pendingDues;
      summary.collectionPercentage = total > 0 ? Math.round((summary.totalCollection / total) * 100) : 0;
    });

    // Fee defaulters (students with pending payments)
    const defaulters = await prisma.student.findMany({
      where: {
        collections: {
          some: {
            status: 'PENDING',
          },
        },
      },
      include: {
        class: true,
        collections: {
          where: { status: 'PENDING' },
          include: { feeMaster: true },
        },
      },
    });

    // Calculate due amounts and days overdue for defaulters
    const defaultersWithDetails = defaulters.map(student => {
      const dueAmount = student.collections.reduce((sum, c) => sum + (c.amount || 0), 0);
      const oldestDue = student.collections.reduce((oldest, c) => {
        return !oldest || (c.feeMaster.dueDate && (!oldest.feeMaster.dueDate || c.feeMaster.dueDate < oldest.feeMaster.dueDate)) ? c : oldest;
      }, student.collections[0]);
      
      const daysOverdue = oldestDue?.feeMaster.dueDate ? 
        Math.floor((new Date().getTime() - new Date(oldestDue.feeMaster.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

      return {
        ...student,
        dueAmount,
        daysOverdue,
      };
    });

    return {
      records: collections,
      summary,
      feeTypeDistribution: Object.values(feeTypeDistribution),
      classSummary: Object.values(classSummary),
      defaulters: defaultersWithDetails,
    };
  } catch (error) {
    console.error('Error generating finance report:', error);
    throw new Error('Failed to generate finance report');
  }
}

// Export functions (placeholder implementations)
export async function exportStudentReport(filters: ReportFilters, format: 'pdf' | 'excel' | 'csv') {
  try {
    // This would integrate with libraries like:
    // - jsPDF for PDF generation
    // - xlsx for Excel generation
    // - csv-writer for CSV generation
    
    console.log(`Exporting student report in ${format} format with filters:`, filters);
    
    // For now, return a success message
    // In a real implementation, this would generate and download the file
    return { success: true, message: `Student report exported as ${format.toUpperCase()}` };
  } catch (error) {
    console.error('Error exporting student report:', error);
    throw new Error('Failed to export student report');
  }
}

export async function exportAttendanceReport(filters: ReportFilters, format: 'pdf' | 'excel' | 'csv') {
  try {
    console.log(`Exporting attendance report in ${format} format with filters:`, filters);
    return { success: true, message: `Attendance report exported as ${format.toUpperCase()}` };
  } catch (error) {
    console.error('Error exporting attendance report:', error);
    throw new Error('Failed to export attendance report');
  }
}

export async function exportFinanceReport(filters: ReportFilters, format: 'pdf' | 'excel' | 'csv') {
  try {
    console.log(`Exporting finance report in ${format} format with filters:`, filters);
    return { success: true, message: `Finance report exported as ${format.toUpperCase()}` };
  } catch (error) {
    console.error('Error exporting finance report:', error);
    throw new Error('Failed to export finance report');
  }
}

// Dashboard summary data
export async function getDashboardSummary() {
  try {
    const [
      totalStudents,
      activeTeachers,
      todayAttendance,
      pendingFees,
    ] = await Promise.all([
      prisma.student.count({ where: { status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { status: 'ACTIVE' } }),
      prisma.attendanceStudent.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
          status: 'PRESENT',
        },
      }),
      prisma.collection.aggregate({
        where: {
          status: 'PENDING',
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalStudents,
      activeTeachers,
      todayAttendance,
      pendingFees: pendingFees._sum?.amount || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return {
      totalStudents: 0,
      activeTeachers: 0,
      todayAttendance: 0,
      pendingFees: 0,
    };
  }
}