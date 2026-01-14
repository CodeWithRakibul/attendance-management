'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconCalendar, IconPlus, IconCheck, IconX, IconClock, IconFileText } from '@tabler/icons-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { createTeacherLeave, getTeacherLeaves, updateTeacherLeave } from '../../actions';

interface TeacherLeavesTabProps {
  teacherId: string;
}

export function TeacherLeavesTab({ teacherId }: TeacherLeavesTabProps) {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingLeave, setIsAddingLeave] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '' as 'SICK' | 'CASUAL' | 'ANNUAL' | 'MATERNITY' | 'EMERGENCY' | '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    reason: '',
  });

  useEffect(() => {
    loadLeaves();
  }, [teacherId]);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const data = await getTeacherLeaves(teacherId);
      setLeaves(data);
    } catch (error) {
      console.error('Failed to load leaves:', error);
      toast.error('Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLeave = async () => {
    if (!leaveForm.leaveType || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const result = await createTeacherLeave({
        teacherId,
        leaveType: leaveForm.leaveType as 'SICK' | 'CASUAL' | 'ANNUAL' | 'MATERNITY' | 'EMERGENCY',
        startDate: leaveForm.startDate.toISOString(),
        endDate: leaveForm.endDate.toISOString(),
        reason: leaveForm.reason,
      });

      if (result.success) {
        toast.success('Leave application submitted successfully');
        setIsAddingLeave(false);
        setLeaveForm({
          leaveType: '',
          startDate: undefined,
          endDate: undefined,
          reason: '',
        });
        loadLeaves();
      } else {
        toast.error(result.error || 'Failed to submit leave application');
      }
    } catch (error) {
      console.error('Failed to submit leave:', error);
      toast.error('Failed to submit leave application');
    }
  };

  const handleUpdateLeaveStatus = async (leaveId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const result = await updateTeacherLeave(leaveId, status, 'Admin'); // Replace with actual admin ID
      
      if (result.success) {
        toast.success(`Leave ${status.toLowerCase()} successfully`);
        loadLeaves();
      } else {
        toast.error(result.error || `Failed to ${status.toLowerCase()} leave`);
      }
    } catch (error) {
      console.error('Failed to update leave status:', error);
      toast.error(`Failed to ${status.toLowerCase()} leave`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><IconCheck className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive"><IconX className="mr-1 h-3 w-3" />Rejected</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><IconClock className="mr-1 h-3 w-3" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateLeaveStats = () => {
    const totalLeaves = leaves.length;
    const approvedLeaves = leaves.filter(l => l.status === 'APPROVED').length;
    const pendingLeaves = leaves.filter(l => l.status === 'PENDING').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'REJECTED').length;

    return { totalLeaves, approvedLeaves, pendingLeaves, rejectedLeaves };
  };

  const stats = calculateLeaveStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Leave Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeaves}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <IconCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedLeaves}</div>
            <p className="text-xs text-muted-foreground">Approved leaves</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <IconClock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <IconX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedLeaves}</div>
            <p className="text-xs text-muted-foreground">Rejected leaves</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Leave Button */}
      <div className="flex justify-end">
        <Dialog open={isAddingLeave} onOpenChange={setIsAddingLeave}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>
                Submit a new leave application. Please provide all required details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select value={leaveForm.leaveType} onValueChange={(value) => setLeaveForm(prev => ({ ...prev, leaveType: value as 'SICK' | 'CASUAL' | 'ANNUAL' | 'MATERNITY' | 'EMERGENCY' | '' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SICK">Sick Leave</SelectItem>
                    <SelectItem value="CASUAL">Casual Leave</SelectItem>
                    <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                    <SelectItem value="MATERNITY">Maternity Leave</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <IconCalendar className="mr-2 h-4 w-4" />
                        {leaveForm.startDate ? format(leaveForm.startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={leaveForm.startDate}
                        onSelect={(date) => setLeaveForm(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <IconCalendar className="mr-2 h-4 w-4" />
                        {leaveForm.endDate ? format(leaveForm.endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={leaveForm.endDate}
                        onSelect={(date) => setLeaveForm(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide the reason for leave..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmitLeave}>
                Submit Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave History */}
      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
          <CardDescription>
            All leave applications and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaves.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No leave records found.
              </div>
            ) : (
              leaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{leave.leaveType}</span>
                      {getStatusBadge(leave.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(leave.startDate), 'PPP')} - {format(new Date(leave.endDate), 'PPP')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Reason: {leave.reason}
                    </div>
                    {leave.approvedBy && (
                      <div className="text-xs text-muted-foreground">
                        Approved by: {leave.approvedBy} on {format(new Date(leave.approvedAt), 'PPP')}
                      </div>
                    )}
                  </div>
                  
                  {leave.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleUpdateLeaveStatus(leave.id, 'APPROVED')}
                      >
                        <IconCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleUpdateLeaveStatus(leave.id, 'REJECTED')}
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leave Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Annual Leave: 21 days per year</p>
          <p>• Sick Leave: 14 days per year</p>
          <p>• Casual Leave: 10 days per year</p>
          <p>• Maternity Leave: 120 days (as per law)</p>
          <p>• Emergency Leave: Subject to approval</p>
          <p>• Leave applications should be submitted at least 3 days in advance</p>
        </CardContent>
      </Card>
    </div>
  );
}