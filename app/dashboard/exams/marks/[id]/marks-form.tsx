'use client'

import { useState, useTransition } from 'react'
import { updateMarksAction } from '@/actions/exam'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

import { DataTable } from '@/components/Table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Props {
  scheduleId: string
  fullMark: number
  students: any[]
  existingMarks: any[]
}

type StudentMark = {
    studentId: string
    name: string
    nameBn?: string
    roll: string
    photoUrl?: string
    guardianName?: string
    guardianPhone?: string
    marksObtained: number | ''
    isAbsent: boolean
}

export default function MarksForm({ scheduleId, fullMark, students, existingMarks }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Initialize state merging students and existing marks
  const [marksState, setMarksState] = useState<StudentMark[]>(
    students.map((student) => {
      const existing = existingMarks.find((m) => m.studentId === student.id)
      const personal = student.personal as any
      const guardian = student.guardian as any
      
      return {
        studentId: student.id, // Using the database ID or the studentId field? Using id used in relation.
        // Actually queries/student.ts getStudents returns data compatible with this?
        // Let's assume student object coming in has the structures from Prisma
        name: personal?.nameEn || 'Unknown',
        nameBn: personal?.nameBn,
        roll: student.roll || 'N/A', 
        photoUrl: personal?.photoUrl,
        guardianName: guardian?.fatherName,
        guardianPhone: guardian?.contact?.smsNo,
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

  const columns: ColumnDef<StudentMark>[] = [
    {
        accessorKey: 'photoUrl',
        header: '',
        cell: ({ row }) => {
            const student = row.original;
            const initials = student.name
                .split(' ')
                .map((n) => n.charAt(0))
                .join('')
                .toUpperCase();

            return (
                <Avatar className='h-8 w-8'>
                    <AvatarImage src={student.photoUrl} alt={student.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            );
        }
    },
    {
        accessorKey: 'roll',
        header: 'Roll',
        cell: ({ row }) => <div className='font-medium'>{row.original.roll}</div>
    },
    {
        accessorKey: 'name',
        header: 'Student Info',
        cell: ({ row }) => (
            <div>
                <div className='font-medium'>{row.original.name}</div>
                {row.original.nameBn && (
                    <div className='text-xs text-muted-foreground'>{row.original.nameBn}</div>
                )}
                <div className='text-xs text-muted-foreground'>ID: {row.original.studentId}</div>
            </div>
        )
    },
    {
        accessorKey: 'guardian',
        header: 'Guardian Info',
        cell: ({ row }) => (
            <div>
               {row.original.guardianName && <div className='text-sm'>{row.original.guardianName}</div>}
               {row.original.guardianPhone && (
                   <div className='text-xs text-muted-foreground flex items-center gap-1'>
                       {row.original.guardianPhone}
                   </div>
               )}
            </div>
        )
    },
    {
        accessorKey: 'marksObtained',
        header: `Marks (/ ${fullMark})`,
        cell: ({ row }) => {
            const index = marksState.findIndex(s => s.studentId === row.original.studentId)
            return (
                <Input 
                    type="number" 
                    min="0"
                    max={fullMark}
                    value={marksState[index].marksObtained}
                    onChange={(e) => handleMarkChange(index, e.target.value)}
                    disabled={marksState[index].isAbsent || isPending}
                    className="w-24"
                    placeholder="0"
                />
            )
        }
    },
    {
        accessorKey: 'isAbsent',
        header: 'Absent',
        cell: ({ row }) => {
            const index = marksState.findIndex(s => s.studentId === row.original.studentId)
            return (
                <div className="flex items-center gap-2">
                    <Checkbox 
                        checked={marksState[index].isAbsent}
                        onCheckedChange={(checked) => handleAbsentChange(index, checked as boolean)}
                        disabled={isPending}
                    />
                    {marksState[index].isAbsent && <Badge variant="destructive" className="text-[10px] h-5">ABSENT</Badge>}
                </div>
            )
        }
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-background/95 backdrop-blur py-4 z-10 sticky top-0 border-b mb-4">
          <div className="text-sm text-muted-foreground">
              Total Students: {marksState.length} | Present: {marksState.filter(s => !s.isAbsent).length}
          </div>
          <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Marks'}
          </Button>
      </div>

      <Card>
          <CardContent className="p-0">
             <DataTable 
                columns={columns} 
                data={marksState}
                enableSearch={true}
                searchPlaceholder="Search student by name or roll..."
                enablePagination={false} 
             />
          </CardContent>
      </Card>
    </div>
  )
}
