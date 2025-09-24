"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

const chartConfig = {
  students: { label: 'Students', color: 'hsl(var(--chart-1))' },
  target: { label: 'Target', color: 'hsl(var(--chart-2))' },
  collection: { label: 'Collection', color: 'hsl(var(--chart-3))' },
  expense: { label: 'Expense', color: 'hsl(var(--chart-4))' },
  attendance: { label: 'Attendance', color: 'hsl(var(--chart-5))' }
}

interface DashboardChartsProps {
  admissionData: any[];
  financeData: any[];
  attendanceData: any[];
  classAttendanceData: any[];
}

export function DashboardCharts({
  admissionData,
  financeData,
  attendanceData,
  classAttendanceData
}: DashboardChartsProps) {
  // Validate and clean data to prevent NaN errors
  const cleanAdmissionData = (admissionData || []).map(item => ({
    month: item?.month || 'N/A',
    students: isFinite(Number(item?.students)) ? Number(item.students) : 0,
    target: isFinite(Number(item?.target)) ? Number(item.target) : 0
  }));

  const cleanFinanceData = (financeData || []).map(item => ({
    month: item?.month || 'N/A',
    collection: isFinite(Number(item?.collection)) ? Number(item.collection) : 0,
    expense: isFinite(Number(item?.expense)) ? Number(item.expense) : 0
  }));

  const cleanAttendanceData = (attendanceData || []).map(item => ({
    name: item?.name || 'Unknown',
    value: isFinite(Number(item?.value)) ? Number(item.value) : 0,
    color: item?.color || '#000000'
  }));

  const cleanClassAttendanceData = (classAttendanceData || []).filter(item => 
    item?.class && isFinite(Number(item?.attendance))
  ).map(item => ({
    class: item.class,
    attendance: Math.max(0, Math.min(100, Number(item.attendance)))
  }));

  // Fallback data if arrays are empty
  const safeClassAttendanceData = cleanClassAttendanceData.length > 0 
    ? cleanClassAttendanceData 
    : [{ class: 'No Data', attendance: 0 }];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Admission Trends Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Admission Trends
          </CardTitle>
          <CardDescription>
            Monthly new student admissions vs targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={cleanAdmissionData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="students"
                type="monotone"
                stroke="var(--color-students)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="target"
                type="monotone"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-slate-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Target</span>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% vs last year
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Collection vs Expense Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Collection vs Expense
          </CardTitle>
          <CardDescription>
            Monthly financial performance comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={cleanFinanceData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}K`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  formatter={(value, name) => [
                    `৳${Number(value).toLocaleString()}`,
                    name === 'collection' ? 'Collection' : 'Expense'
                  ]}
                />}
              />
              <Bar dataKey="collection" fill="var(--color-collection)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Collection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Expense</span>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-200">
              Profit: ৳3.7L
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Percentage Pie Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Today's Attendance
          </CardTitle>
          <CardDescription>
            Overall attendance distribution for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />}
              />
              <Pie
                data={cleanAttendanceData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            {cleanAttendanceData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-muted-foreground">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Class-wise Attendance Bar Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Class-wise Attendance
          </CardTitle>
          <CardDescription>
            Attendance percentage by class for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {safeClassAttendanceData.length > 0 && safeClassAttendanceData[0].class !== 'No Data' ? (
            <ChartContainer config={chartConfig}>
              <BarChart data={safeClassAttendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <ChartTooltip
                  content={<ChartTooltipContent
                    formatter={(value) => [`${value}%`, 'Attendance']}
                  />}
                />
                <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No attendance data available
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Average: {safeClassAttendanceData.length > 0 && safeClassAttendanceData[0].class !== 'No Data' ?
                Math.round(safeClassAttendanceData.reduce((sum, item) => sum + item.attendance, 0) / safeClassAttendanceData.length)
                : 0}%
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Target: 85%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}