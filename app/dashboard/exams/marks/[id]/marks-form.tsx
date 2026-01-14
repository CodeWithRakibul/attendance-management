'use client'

import { useState, useTransition } from 'react'
import { updateMarksAction } from '@/actions/exam'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  scheduleId: string
  fullMark: number
  students: any[]
  existingMarks: any[]
}

export default function MarksForm({ scheduleId, fullMark, students, existingMarks }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Initialize state merging students and existing marks
  const [marksState, setMarksState] = useState(
    students.map((student) => {
      const existing = existingMarks.find((m) => m.studentId === student.id)
      return {
        studentId: student.id,
        name: student.personal?.nameEn || student.name || 'Unknown',
        roll: student.classRoll || 'N/A', // Assuming classRoll exists on student or somewhere
        marksObtained: existing ? existing.marksObtained : '',
        isAbsent: existing ? existing.isAbsent : false,
      }
    })
  )

  const handleMarkChange = (index: number, value: string) => {
    const val = value === '' ? '' : Number(value)
    if (typeof val === 'number' && (val < 0 || val > fullMark)) {
      toast.error(`Marks must be between 0 and ${fullMark}`)
      return
    }

    const newMarks = [...marksState]
    newMarks[index].marksObtained = val
    if (val !== '' && val > 0) {
        newMarks[index].isAbsent = false
    }
    setMarksState(newMarks)
  }

  const handleAbsentChange = (index: number, checked: boolean) => {
    const newMarks = [...marksState]
    newMarks[index].isAbsent = checked
    if (checked) {
      newMarks[index].marksObtained = 0
    }
    setMarksState(newMarks)
  }

  const handleSubmit = async () => {
    startTransition(async () => {
      // Filter out students with no marks entered (unless marked absent)
      // Actually we might want to save whatever is entered. 
      // But typically we convert empty string to 0 or null?
      // The action expects number.
      
      const payload = marksState.map(m => ({
          studentId: m.studentId,
          marksObtained: m.marksObtained === '' ? 0 : m.marksObtained,
          isAbsent: m.isAbsent
      }))

      const result = await updateMarksAction(scheduleId, payload)
      
      if (result.success) {
        toast.success('Marks updated successfully')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to update marks')
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end sticky top-0 bg-background/95 backdrop-blur py-4 z-10">
          <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Marks'}
          </Button>
      </div>

      <Card>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Student Name</th>
                            <th className="px-6 py-3 w-32">Obtained Marks (Out of {fullMark})</th>
                            <th className="px-6 py-3 w-24">Absent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marksState.map((student, index) => (
                            <tr key={student.studentId} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">
                                    <div className="flex flex-col">
                                        <span>{student.name}</span>
                                        <span className="text-xs text-muted-foreground">ID: {student.studentId}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Input 
                                        type="number" 
                                        min="0"
                                        max={fullMark}
                                        value={student.marksObtained}
                                        onChange={(e) => handleMarkChange(index, e.target.value)}
                                        disabled={student.isAbsent || isPending}
                                        className="w-24"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <Checkbox 
                                        checked={student.isAbsent}
                                        onCheckedChange={(checked) => handleAbsentChange(index, checked as boolean)}
                                        disabled={isPending}
                                    />
                                </td>
                            </tr>
                        ))}
                        {marksState.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                    No students found for this class.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </CardContent>
      </Card>
    </div>
  )
}
