'use client';

import { useState } from 'react';
import {
    deleteStudentAction,
    bulkDeleteStudentsAction,
    updateStudentStatusAction
} from '../actions';
import { toast } from 'sonner';
import { EditStudentDialog } from './edit-student-dialog';
import { StudentDetailsDialog } from './student-details-dialog';
import { DataTable, createSelectionColumn } from '@/components/Table/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    IconDotsVertical,
    IconEye,
    IconEdit,
    IconTrash,
    IconPhone,
    IconMail,
    IconDownload
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { format, isValid } from 'date-fns';
import { StudentTableData } from '@/types';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

interface StudentsDataTableProps {
    students: StudentTableData[];
    sessions: Array<{ id: string; year: string }>;
    classes: Array<{ id: string; name: string }>;
    batches: Array<{ id: string; name: string }>;
    sections: Array<{ id: string; name: string }>;
}

export function StudentsDataTable({
    students,
    sessions,
    classes,
    batches,
    sections
}: StudentsDataTableProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [editStudent, setEditStudent] = useState<StudentTableData | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewStudent, setViewStudent] = useState<StudentTableData | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const { push } = useRouter()

    const handleBulkDelete = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;

        setIsLoading(true);
        try {
            const result = await bulkDeleteStudentsAction(selectedIds);
            if (result.success) {
                toast.success(`${selectedIds.length} students deleted successfully`);
            } else {
                toast.error(result.error || 'Failed to delete students');
            }
        } catch (error) {
            toast.error('Failed to delete students');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportSelected = (selectedIds: string[]) => {
        const selectedStudentData = students.filter((student) => selectedIds.includes(student.id));
        const csvContent = generateCSV(selectedStudentData);
        downloadCSV(csvContent, 'selected-students.csv');
    };

    const handleExportAll = () => {
        const csvContent = generateCSV(students);
        downloadCSV(csvContent, 'all-students.csv');
    };

    const generateCSV = (data: StudentTableData[]) => {
        const headers = [
            'ID',
            'Name (English)',
            'Name (Bengali)',
            'Class',
            'Section',
            'Batch',
            'Phone',
            'Email',
            'Status',
            'Admission Date'
        ];
        const rows = data.map((student) => {
            const personal = student.personal as any;
            const guardian = student.guardian as any;
            const contact = guardian?.contact || {};

            return [
                student.studentId,
                personal?.nameEn || '',
                personal?.nameBn || '',
                student.class?.name || '',
                student.section?.name || '',
                student.batch?.name || '',
                contact?.smsNo || '',
                contact?.email || '',
                student.status,
                student.createdAt ? format(new Date(student.createdAt), 'dd/MM/yyyy') : ''
            ];
        });

        return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    };

    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Filter options for the data table
    const filters = [
        {
            columnId: 'className',
            title: 'Class',
            options: classes.map((cls) => ({ label: cls.name, value: cls.name }))
        },
        {
            columnId: 'sectionName',
            title: 'Section',
            options: sections.map((section) => ({ label: section.name, value: section.name }))
        },
        {
            columnId: 'batchName',
            title: 'Batch',
            options: batches.map((batch) => ({ label: batch.name, value: batch.name }))
        },
        {
            columnId: 'status',
            title: 'Status',
            options: [
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
                { label: 'Disabled', value: 'DISABLED' }
            ]
        },
        {
            columnId: 'gender',
            title: 'Gender',
            options: [
                { label: 'Male', value: 'MALE' },
                { label: 'Female', value: 'FEMALE' },
                { label: 'Other', value: 'OTHER' }
            ]
        }
    ];

    return (
        <Card>
            <CardContent>
                <DataTable
                    data={students}
                    columns={columns}
                    enableRowSelection={true}
                    enableSearch={true}
                    searchPlaceholder='Search students...'
                    enablePagination={true}
                    pageSize={10}
                    getRowId={(row) => row.id}
                    onDeleteSelected={handleBulkDelete}
                    createNewLabel='Export All'
                    onCreateNew={handleExportAll}
                    showCreateButton
                    showDeleteButton={true}
                    createIcon={<IconDownload className='h-4 w-4' />}
                    deleteButtonLabel='Delete Selected'
                    filters={filters}
                />
            </CardContent>

            {/* Dialogs */}
            <EditStudentDialog
                student={editStudent}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                sessions={sessions}
                classes={classes}
                batches={batches}
                sections={sections}
            />

            <StudentDetailsDialog
                student={viewStudent}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
            />
        </Card>
    );
}
