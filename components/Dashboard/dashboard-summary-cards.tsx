'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  UserCheck,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { getDashboardSummary } from '@/lib/actions/dashboard';

interface ExtendedDashboardSummary {
  totalStudents: number;
  activeTeachers: number;
  todayAttendance: number;
  pendingFees: number;
  totalRevenue?: number;
  monthlyGrowth?: {
    students: number;
    revenue: number;
    attendance: number;
  };
}

export function DashboardSummaryCards() {
  const [summary, setSummary] = useState<ExtendedDashboardSummary>({
    totalStudents: 0,
    activeTeachers: 0,
    todayAttendance: 0,
    pendingFees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to load dashboard summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Students',
      value: summary.totalStudents,
      description: 'Active enrolled students',
      icon: Users,
      trend: '+12.5%',
      trendUp: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Teachers',
      value: summary.activeTeachers,
      description: 'Currently teaching staff',
      icon: GraduationCap,
      trend: '+2',
      trendUp: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: "Today's Attendance",
      value: summary.todayAttendance,
      description: 'Students present today',
      icon: UserCheck,
      trend: '85%',
      trendUp: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Fees',
      value: `৳${summary.pendingFees.toLocaleString()}`,
      description: 'Outstanding payments',
      icon: DollarSign,
      trend: '-5.2%',
      trendUp: false,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse !gap-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="relative overflow-hidden !gap-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {typeof card.value === 'number' && card.title !== 'Pending Fees' 
                  ? card.value.toLocaleString() 
                  : card.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    card.trendUp 
                      ? 'text-green-600 border-green-200' 
                      : 'text-red-600 border-red-200'
                  }`}
                >
                  {card.trendUp ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
            
            {/* Decorative gradient */}
            <div className={`absolute top-0 right-0 w-20 h-20 ${card.bgColor} opacity-10 rounded-full -translate-y-10 translate-x-10`}></div>
          </Card>
        );
      })}
    </div>
  );
}