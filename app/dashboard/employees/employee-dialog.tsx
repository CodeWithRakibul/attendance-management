"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmployeeForm } from "./employee-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EmployeeData {
  id?: number
  firstName: string
  lastName: string
  email: string
  phone: string
  designation: string
  birthDate: Date | undefined
  joiningDate: Date | undefined
  type: "FULL_TIME" | "PERMANENT" | "INTERN" | "PART_TIME" | "CONTRACT" | "TEMPORARY"
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED" | "ON_LEAVE" | "RESIGNED"
  image: string
  deviceUserId: string
}

interface EmployeeDialogProps {
  isOpen: boolean
  onClose: () => void
  employee?: any | null
  mode: "create" | "edit"
}

export function EmployeeDialog({ isOpen, onClose, employee, mode }: EmployeeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: Omit<EmployeeData, "id">) => {
    setIsLoading(true)
    
    try {
      const url = "/api/employees"
      const method = mode === "create" ? "POST" : "PUT"
      
      const payload = {
        ...formData,
        birthDate: formData.birthDate?.toISOString(),
        joiningDate: formData.joiningDate?.toISOString(),
        ...(mode === "edit" && employee?.id && { id: employee.id }),
        ...(mode === "create" && { userId: 1 }) // Default user ID - you might want to get this from auth context
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${mode} employee`)
      }

      toast.success(
        mode === "create" 
          ? "Employee created successfully!" 
          : "Employee updated successfully!"
      )
      
      onClose()
      router.refresh() // Refresh the page to show updated data
      
    } catch (error) {
      console.error(`Error ${mode}ing employee:`, error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : `Failed to ${mode} employee. Please try again.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Employee" : "Edit Employee"}
          </DialogTitle>
        </DialogHeader>
        
        <EmployeeForm
          initialData={employee || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  )
}