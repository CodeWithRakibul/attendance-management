'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

// Sample data - in a real app, this would come from the database
const admissionTrendsData = [
  { month: 'Jan', students: 45, target: 50 },
  { month: 'Feb', students: 52, target: 50 },
  { month: 'Mar', students: 48, target: 50 },
  { month: 'Apr', students: 61, target: 60 },
  { month: 'May', students: 55, target: 60 },
  { month: 'Jun', students: 67, target: 60 },
  { month: 'Jul', students: 72, target: 70 },
  { month: 'Aug', students: 69, target: 70 },
  { month: 'Sep', students: 78, target: 75 },
  { month: 'Oct', students: 82, target: 80 },
  { month: 'Nov', students: 79, target: 80 },
  { month: 'Dec', students: 85, target: 85 },
];

const collectionVsExpenseData = [
  { month: 'Jan', collection: 450000, expense: 320000 },
  { month: 'Feb', collection: 520000, expense: 340000 },
  { month: 'Mar', collection: 480000, expense: 350000 },
  { month: 'Apr', collection: 610000, expense: 380000 },
  { month: 'May', collection: 550000, expense: 360000 },
  { month: 'Jun', collection: 670000, expense: 400000 },
  { month: 'Jul', collection: 720000, expense: 420000 },
  { month: 'Aug', collection: 690000, expense: 410000 },
  { month: 'Sep', collection: 780000, expense: 450000 },
  { month: 'Oct', collection: 820000, expense: 470000 },
  { month: 'Nov', collection: 790000, expense: 460000 },
  { month: 'Dec', collection: 850000, expense: 480000 },
];

const attendanceData = [
  { name: 'Present', value: 85, color: '#10b981' },
  { name: 'Absent', value: 12, color: '#ef4444' },
  { name: 'Late', value: 3, color: '#f59e0b' },
];

const classWiseAttendanceData = [
  { class: 'Class 6', attendance: 88 },
  { class: 'Class 7', attendance: 92 },
  { class: 'Class 8', attendance: 85 },
  { class: 'Class 9', attendance: 90 },
  { class: 'Class 10', attendance: 87 },
  { class: 'HSC 1st', attendance: 82 },
  { class: 'HSC 2nd', attendance: 79 },
];

export function DashboardCharts() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={admissionTrendsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                name="Admissions"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#94a3b8', strokeWidth: 2, r: 3 }}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={collectionVsExpenseData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  `৳${value.toLocaleString()}`,
                  name === 'collection' ? 'Collection' : 'Expense'
                ]}
              />
              <Bar 
                dataKey="collection" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="Collection"
              />
              <Bar 
                dataKey="expense" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                name="Expense"
              />
            </BarChart>
          </ResponsiveContainer>
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
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            {attendanceData.map((item, index) => (
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
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={classWiseAttendanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                type="number" 
                domain={[0, 100]}
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                type="category" 
                dataKey="class" 
                className="text-xs"
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Attendance']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="attendance" 
                fill="#f59e0b"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Average: 86.1%
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