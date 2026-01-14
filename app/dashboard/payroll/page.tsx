import { getSalaryPayments, getPayrollStats } from '@/queries/payroll'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { format } from 'date-fns'

export default async function PayrollPage() {
    const data = await getSalaryPayments()
    const stats = await getPayrollStats()

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
            
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳ {stats.monthlyTotal.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Salary Payment History</CardTitle>
                    <CardDescription>Recent salary payments to staff</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.length === 0 ? (
                            <p className="text-center text-muted-foreground py-6">No payment records found.</p>
                        ) : (
                            <div className="border rounded-md">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium">Staff</th>
                                            <th className="px-4 py-3 text-left font-medium">Designation</th>
                                            <th className="px-4 py-3 text-left font-medium">Month</th>
                                            <th className="px-4 py-3 text-right font-medium">Amount</th>
                                            <th className="px-4 py-3 text-right font-medium">Date</th>
                                            <th className="px-4 py-3 text-center font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((payment) => (
                                            <tr key={payment.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">
                                                    {(payment.teacher.personal as any)?.nameEn || 'Unknown'}
                                                    <span className="block text-xs text-gray-500">{payment.teacher.staffId}</span>
                                                </td>
                                                <td className="px-4 py-3 ">{payment.teacher.designation}</td>
                                                <td className="px-4 py-3">{payment.month}</td>
                                                <td className="px-4 py-3 text-right font-bold">৳ {payment.amount.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right">{format(new Date(payment.paymentDate), 'MMM d, yyyy')}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
