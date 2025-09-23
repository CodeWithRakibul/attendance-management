'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconEdit, IconX } from '@tabler/icons-react';
import { Teacher } from './columns';
import { getTeacher } from './actions';
import { TeacherOverviewTab } from './tabs/teacher-overview-tab';
import { TeacherAttendanceTab } from './tabs/teacher-attendance-tab';
import { TeacherLeavesTab } from './tabs/teacher-leaves-tab';
import { TeacherSalaryTab } from './tabs/teacher-salary-tab';
import { TeacherEditForm } from './tabs/teacher-edit-form';

interface TeacherDialogProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherDialog({ teacher, open, onOpenChange }: TeacherDialogProps) {
  const [detailedTeacher, setDetailedTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (teacher && open) {
      loadTeacherDetails();
    }
  }, [teacher, open]);

  const loadTeacherDetails = async () => {
    if (!teacher) return;
    
    setLoading(true);
    try {
      const details = await getTeacher(teacher.id);
      setDetailedTeacher(details);
    } catch (error) {
      console.error('Failed to load teacher details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    loadTeacherDetails(); // Reload data after edit
  };

  if (!teacher) return null;

  const name = teacher.personal.nameEn;
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={teacher.personal.photoUrl} alt={name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{name}</DialogTitle>
              {teacher.personal.nameBn && (
                <p className="text-sm text-muted-foreground">{teacher.personal.nameBn}</p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{teacher.teacherId}</Badge>
                <Badge variant={teacher.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {teacher.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <IconEdit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {isEditing ? (
          <div className="p-6">
            <TeacherEditForm 
              teacher={detailedTeacher || teacher}
              onCancel={() => setIsEditing(false)}
              onComplete={handleEditComplete}
            />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="leaves">Leaves</TabsTrigger>
              <TabsTrigger value="salary">Salary</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <TeacherOverviewTab teacher={detailedTeacher || teacher} loading={loading} />
            </TabsContent>

            <TabsContent value="attendance" className="mt-6">
              <TeacherAttendanceTab teacherId={teacher.id} />
            </TabsContent>

            <TabsContent value="leaves" className="mt-6">
              <TeacherLeavesTab teacherId={teacher.id} />
            </TabsContent>

            <TabsContent value="salary" className="mt-6">
              <TeacherSalaryTab teacher={detailedTeacher || teacher} loading={loading} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}