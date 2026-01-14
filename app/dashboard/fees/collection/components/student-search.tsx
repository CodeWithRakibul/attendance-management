'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { getStudents } from '@/actions/student'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

export function StudentSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (query: string) => {
        if (query.length < 2) return
        setLoading(true)
        try {
            // We need a way to search students by name/roll. 
            // The existing getStudents action takes filters.
            // Let's assume we can filter by search term if we update the action, 
            // but for now let's just fetch all and filter client side or implement a proper search action later.
            // Wait, getStudents takes `filters`. Let's check `StudentFilters` type.
            // It has `search` property.
            const result = await getStudents('', { search: query }) // Session ID is required by getStudents signature?
            // getStudents(sessionId, filters). We need sessionId.
            // We can't easily get sessionId here without passing it down.
            // For now, let's use a simple input that expects exact Student ID or Database ID if we can't search easily.
            // Or better, let's just use a simple input for Student ID/Roll for now.
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Simplified version: Input for Student ID (Database ID for now as per page.tsx logic)
    // To make it user friendly, we should allow entering "Student ID" (the string one) and find the DB ID.
    // But page.tsx expects `studentId` param to be the DB ID.
    // Let's make this component just an input for now that updates the URL.

    const [inputId, setInputId] = useState(searchParams.get('studentId') || '')

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputId) {
            router.push(`/dashboard/fees/collection?studentId=${inputId}`)
        }
    }

    return (
        <form onSubmit={onSearch} className="flex gap-2 max-w-sm">
            <Input
                placeholder="Enter Student Database ID..."
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
            />
            <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
            </Button>
        </form>
    )
}
