"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmployeeForm } from "./employee-form"
import { toast } from "sonner"
import { createEmployee, updateEmployee } from "./actions"
import { EmployeeData } from "@/types/employee"

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
      let result;
      if (mode === "create") {
        const createPayload = {
          ...formData,
          userId: 1, // Default user ID - you might want to get this from auth context
          birthDate: formData.birthDate,
          joiningDate: formData.joiningDate,
        };
        result = await createEmployee(createPayload);
      } else if (mode === "edit" && employee?.id) {
        const updatePayload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          designation: formData.designation,
          birthDate: formData.birthDate,
          joiningDate: formData.joiningDate,
          type: formData.type,
          status: formData.status,
          image: formData.image,
          deviceUserId: formData.deviceUserId,
        };
        result = await updateEmployee(employee.id, updatePayload);
      }

      if (!result?.success) {
        throw new Error(result?.error || `Failed to ${mode} employee`)
      }

      toast.success(
        mode === "create" 
          ? "Employee created successfully!" 
          : "Employee updated successfully!"
      )
      
      router.refresh()
      onClose()
      
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