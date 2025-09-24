import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  IconUsers, 
  IconUserCheck, 
  IconUserPlus, 
  IconCreditCard,
  IconTrendingUp,
  IconTrendingDown
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';

interface StudentsStatsProps {
  totalStudents: number;
  activeStudents: number;
  newAdmissions: number;
  pendingFees: number;
  previousMonthAdmissions?: number;
}

export function StudentsStats({ 
  totalStudents, 
  activeStudents, 
  newAdmissions, 
  pendingFees,
  previousMonthAdmissions = 0
}: StudentsStatsProps) {
  // Ensure all values are valid numbers
  const safeNewAdmissions = Number(newAdmissions) || 0;
  const safePreviousMonthAdmissions = Number(previousMonthAdmissions) || 0;
  const safeTotalStudents = Number(totalStudents) || 0;
  const safeActiveStudents = Number(activeStudents) || 0;
  const safePendingFees = Number(pendingFees) || 0;
  
  const admissionTrend = safeNewAdmissions - safePreviousMonthAdmissions;
  const activePercentage = safeTotalStudents > 0 ? Math.round((safeActiveStudents / safeTotalStudents) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200 !gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          <div className="p-2 bg-blue-100 rounded-full">
            <IconUsers className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{safeTotalStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Registered students
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200 !gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
          <div className="p-2 bg-green-100 rounded-full">
            <IconUserCheck className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-green-600">{safeActiveStudents}</div>
            <Badge variant="secondary" className="text-xs">
              {activePercentage}%
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Currently enrolled
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-200 !gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">New Admissions</CardTitle>
          <div className="p-2 bg-purple-100 rounded-full">
            <IconUserPlus className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-purple-600">{safeNewAdmissions}</div>
            {admissionTrend !== 0 && (
              <div className={`flex items-center gap-1 ${admissionTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {admissionTrend > 0 ? (
                  <IconTrendingUp className="h-3 w-3" />
                ) : (
                  <IconTrendingDown className="h-3 w-3" />
                )}
                <span className="text-xs font-medium">
                  {Math.abs(admissionTrend)}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This month
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow duration-200 !gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Fees</CardTitle>
          <div className="p-2 bg-orange-100 rounded-full">
            <IconCreditCard className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{safePendingFees}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Students with dues
          </p>
        </CardContent>
      </Card>
    </div>
  );
}