'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconCreditCard, IconCheck, IconX, IconClock, IconDownload, IconPlus, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { format } from 'date-fns';

interface StudentFeesTabProps {
  student: any;
}

export function StudentFeesTab({ student }: StudentFeesTabProps) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student?.collections) {
      setCollections(student.collections);
    }
  }, [student]);

  const calculateFeesStats = () => {
    if (!collections.length) {
      return { 
        totalPaid: 0, 
        totalDue: 0, 
        totalAmount: 0, 
        paidCount: 0, 
        dueCount: 0,
        lastPayment: null 
      };
    }

    const totalPaid = collections
      .filter(c => c.status === 'PAID')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalDue = collections
      .filter(c => c.status === 'DUE')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const totalAmount = totalPaid + totalDue;
    const paidCount = collections.filter(c => c.status === 'PAID').length;
    const dueCount = collections.filter(c => c.status === 'DUE').length;
    
    const lastPayment = collections
      .filter(c => c.status === 'PAID')
      .sort((a, b) => new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime())[0];

    return { totalPaid, totalDue, totalAmount, paidCount, dueCount, lastPayment };
  };

  const stats = calculateFeesStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <IconCheck className="h-4 w-4 text-green-600" />;
      case 'DUE':
        return <IconClock className="h-4 w-4 text-yellow-600" />;
      case 'OVERDUE':
        return <IconX className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PAID: 'default',
      DUE: 'secondary',
      OVERDUE: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Fee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.paidCount} payments made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <IconTrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalDue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.dueCount} pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Overall fee amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
            {stats.totalAmount > 0 && (stats.totalPaid / stats.totalAmount) >= 0.8 ? (
              <IconTrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <IconTrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              stats.totalAmount > 0 && (stats.totalPaid / stats.totalAmount) >= 0.8 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {stats.totalAmount > 0 ? Math.round((stats.totalPaid / stats.totalAmount) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Payment completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Last Payment Info */}
      {stats.lastPayment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCheck className="h-5 w-5 text-green-600" />
              Last Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {stats.lastPayment.feeMaster?.name || 'Fee Payment'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Paid on {format(new Date(stats.lastPayment.paidAt || stats.lastPayment.createdAt), 'MMMM d, yyyy')}
                </p>
                {stats.lastPayment.collector && (
                  <p className="text-sm text-muted-foreground">
                    Collected by: {stats.lastPayment.collector.name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.lastPayment.amount)}
                </p>
                <Badge variant="default">PAID</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fee History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Fee History
            </CardTitle>
            <Button size="sm" variant="outline">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading fee data...</div>
          ) : collections.length > 0 ? (
            <div className="space-y-3">
              {collections
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((collection, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(collection.status)}
                    <div>
                      <p className="font-medium">
                        {collection.feeMaster?.name || 'Fee Payment'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {collection.feeMaster?.description || 'No description'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {collection.status === 'PAID' 
                          ? `Paid on ${format(new Date(collection.paidAt || collection.createdAt), 'MMM d, yyyy')}`
                          : `Due date: ${format(new Date(collection.dueDate || collection.createdAt), 'MMM d, yyyy')}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatCurrency(collection.amount)}
                      </p>
                      {getStatusBadge(collection.status)}
                    </div>
                    
                    {collection.status === 'PAID' && (
                      <Button size="sm" variant="outline">
                        <IconDownload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No fee records found for this student.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fee Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Payment Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-green-600" />
              <span><strong>Paid:</strong> Fee has been successfully paid</span>
            </div>
            <div className="flex items-center gap-2">
              <IconClock className="h-4 w-4 text-yellow-600" />
              <span><strong>Due:</strong> Fee payment is pending within due date</span>
            </div>
            <div className="flex items-center gap-2">
              <IconX className="h-4 w-4 text-red-600" />
              <span><strong>Overdue:</strong> Fee payment is past the due date</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Late fee charges may apply for overdue payments. Please contact the administration for payment arrangements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}