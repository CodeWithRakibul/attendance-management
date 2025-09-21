"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconDotsVertical, IconUser } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"

// Use a flexible type that matches the API response
type EmployeeData = {
    id: number
    name: string
    phone: string | null
    designation: string | null
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED"
    user: {
        id: number
        name: string
        email: string
    }
    shifts: Array<{
        shift: {
            id: number
            name: string
            checkInTime: string
            checkOutTime: string
        }
    }>
}


const getStatusColor = (status: string) => {
    switch (status) {
        case "ACTIVE": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        case "INACTIVE": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
        case "SUSPENDED": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        case "TERMINATED": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
}

export const columns: ColumnDef<EmployeeData>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Employee Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <IconUser className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{row.original.name}</span>
            </div>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "user.email",
        header: "Email",
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.user.email}</span>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.phone || "N/A"}</span>
        ),
    },
    {
        accessorKey: "designation",
        header: "Designation",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground">
                {row.original.designation || "Not Assigned"}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge className={getStatusColor(row.original.status)}>
                {row.original.status}
            </Badge>
        ),
        filterFn: (row, id, value) => {
            if (!value || !Array.isArray(value) || value.length === 0) {
                return true // Show all rows when no filter is applied
            }
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "shifts",
        header: "Shifts",
        cell: ({ row }) => {
            const shifts = row.original.shifts || []
            return (
                <div className="flex flex-wrap gap-1">
                    {shifts.length > 0 ? (
                        shifts.map((employeeShift, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {employeeShift.shift.name}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground text-sm">No shifts</span>
                    )}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

