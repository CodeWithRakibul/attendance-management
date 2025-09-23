'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconCurrencyTaka, IconCalendar, IconTrendingUp, IconDownload, IconCheck, IconClock, IconX } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';

interface TeacherSalaryTabProps {
  teacher: any;
  loading: boolean;
}

export function TeacherSalaryTab({ teacher, loading }: TeacherSalaryTabProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    loadPaymentHistory();
  }, [teacher, selectedYear]);

  const loadPaymentHistory = async () => {
    // Mock data - replace with actual API call
    const mockPayments = [
      {
        id: '1',
        month: 'January 2024',
        basicSalary: 25000,
        allowances: 5000,
        deductions: 2000,
        netSalary: 28000,
        status: 'PAID',
        paidDate: '2024-01-31',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: '2',
        month: 'February 2024',
        basicSalary: 25000,
        allowances: 5000,
        deductions: 1500,
        netSalary: 28500,
        status: 'PAID',
        paidDate: '2024-02-29',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: '3',
        month: 'March 2024',
        basicSalary: 25000,
        allowances: 5000,
        deductions: 2000,
        netSalary: 28000,
        status: 'PENDING',
        paidDate: null,
        paymentMethod: 'Bank Transfer'
      },
    ];
    setPaymentHistory(mockPayments);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><IconCheck className="mr-1 h-3 w-3" />Paid</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><IconClock className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive"><IconX className="mr-1 h-3 w-3" />Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateYearlyStats = () => {
    const paidPayments = paymentHistory.filter(p => p.status === 'PAID');
    const totalPaid = paidPayments.reduce((sum, p) => sum + p.netSalary, 0);
    const totalBasic = paidPayments.reduce((sum, p) => sum + p.basicSalary, 0);
    const totalAllowances = paidPayments.reduce((sum, p) => sum + p.allowances, 0);
    const totalDeductions = paidPayments.reduce((sum, p) => sum + p.deductions, 0);

    return { totalPaid, totalBasic, totalAllowances, totalDeductions };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = calculateYearlyStats();

  return (
    <div className="space-y-6">
      {/* Year Filter */}
      <div className="flex items-center space-x-4">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Current Salary Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconCurrencyTaka className="mr-2 h-5 w-5" />
              Current Salary Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Basic Salary</span>
              <span className="text-sm">৳{teacher.salaryInfo?.basic?.toLocaleString() || '0'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Allowances</span>
              <span className="text-sm">৳{teacher.salaryInfo?.allowances?.toLocaleString() || '0'}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center font-medium">
              <span>Gross Salary</span>
              <span className="text-lg">৳{((teacher.salaryInfo?.basic || 0) + (teacher.salaryInfo?.allowances || 0)).toLocaleString()}</span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Payment Method: {teacher.salaryInfo?.paymentMethod || 'Bank Transfer'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconTrendingUp className="mr-2 h-5 w-5" />
              Yearly Summary ({selectedYear})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Paid</span>
              <span className="text-sm font-bold text-green-600">৳{stats.totalPaid.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Basic</span>
              <span className="text-sm">৳{stats.totalBasic.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Allowances</span>
              <span className="text-sm">৳{stats.totalAllowances.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Deductions</span>
              <span className="text-sm text-red-600">৳{stats.totalDeductions.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Monthly salary payments and details for {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No payment records found for {selectedYear}.
              </div>
            ) : (
              paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{payment.month}</span>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Basic: ৳{payment.basicSalary.toLocaleString()} | 
                      Allowances: ৳{payment.allowances.toLocaleString()} | 
                      Deductions: ৳{payment.deductions.toLocaleString()}
                    </div>
                    {payment.paidDate && (
                      <div className="text-xs text-muted-foreground">
                        Paid on: {new Date(payment.paidDate).toLocaleDateString()} via {payment.paymentMethod}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold">৳{payment.netSalary.toLocaleString()}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      {payment.status === 'PAID' && (
                        <Button variant="outline" size="sm">
                          <IconDownload className="h-4 w-4 mr-1" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Salary Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Components</CardTitle>
          <CardDescription>
            Breakdown of salary components and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">Earnings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span>৳{teacher.salaryInfo?.basic?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>House Rent Allowance</span>
                  <span>৳{Math.round((teacher.salaryInfo?.basic || 0) * 0.4).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Allowance</span>
                  <span>৳{Math.round((teacher.salaryInfo?.allowances || 0) * 0.3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical Allowance</span>
                  <span>৳{Math.round((teacher.salaryInfo?.allowances || 0) * 0.2).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-red-600">Deductions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Income Tax</span>
                  <span>৳{Math.round((teacher.salaryInfo?.basic || 0) * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provident Fund</span>
                  <span>৳{Math.round((teacher.salaryInfo?.basic || 0) * 0.08).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Tax</span>
                  <span>৳200</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Salary is processed on the last working day of each month</p>
          <p>• Provident Fund: 8% of basic salary (matched by institution)</p>
          <p>• Annual increment: Based on performance review</p>
          <p>• Bonus: Festival bonus equivalent to one month's basic salary</p>
          <p>• Tax deductions are calculated as per government regulations</p>
        </CardContent>
      </Card>
    </div>
  );
}