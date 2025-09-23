'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconPlus, IconEdit, IconTrash, IconCalendar, IconNote } from '@tabler/icons-react';
import { format } from 'date-fns';
import { addStudentNote } from '../actions';
import { toast } from 'sonner';

interface StudentNotesTabProps {
    student: any;
    onNotesUpdate?: () => void;
}

interface Note {
    id: string;
    content: string;
    type: 'GENERAL' | 'ACADEMIC' | 'BEHAVIORAL' | 'MEDICAL' | 'PARENT_CONTACT';
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: string;
        name: string;
        email: string;
    };
}

export function StudentNotesTab({ student, onNotesUpdate }: StudentNotesTabProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [noteType, setNoteType] = useState<Note['type']>('GENERAL');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (student?.notes) {
            setNotes(student.notes);
        }
    }, [student]);

    const handleAddNote = async () => {
        if (!newNote || newNote.replace(/^\s+|\s+$/g, '') === '') {
            toast.error('Please enter a note');
            return;
        }

        setLoading(true);
        try {
            const result = await addStudentNote(
                student.id,
                'current-staff-id',
                newNote.replace(/^\s+|\s+$/g, '')
            );

            if (result.success) {
                // Add the new note to the local state
                const newNoteObj: Note = {
                    id: Date.now().toString(), // Temporary ID
                    content: newNote.replace(/^\s+|\s+$/g, ''),
                    type: noteType,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: {
                        id: 'current-user',
                        name: 'Current User',
                        email: 'user@example.com'
                    }
                };

                setNotes((prev) => [newNoteObj, ...prev]);
                setNewNote('');
                setNoteType('GENERAL');
                setIsAdding(false);
                toast.success('Note added successfully');
            } else {
                toast.error(result.error || 'Failed to add note');
            }
        } catch (error) {
            toast.error('Failed to add note');
        } finally {
            setLoading(false);
        }
    };

    const getNoteTypeColor = (type: Note['type']) => {
        const colors = {
            GENERAL: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            ACADEMIC: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            BEHAVIORAL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            MEDICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            PARENT_CONTACT: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        };
        return colors[type] || colors.GENERAL;
    };

    const getNoteTypeLabel = (type: Note['type']) => {
        const labels = {
            GENERAL: 'General',
            ACADEMIC: 'Academic',
            BEHAVIORAL: 'Behavioral',
            MEDICAL: 'Medical',
            PARENT_CONTACT: 'Parent Contact'
        };
        return labels[type] || 'General';
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const noteTypeOptions = [
        { value: 'GENERAL', label: 'General' },
        { value: 'ACADEMIC', label: 'Academic' },
        { value: 'BEHAVIORAL', label: 'Behavioral' },
        { value: 'MEDICAL', label: 'Medical' },
        { value: 'PARENT_CONTACT', label: 'Parent Contact' }
    ] as const;

    return (
        <div className='space-y-6'>
            {/* Add New Note */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='flex items-center gap-2'>
                            <IconNote className='h-5 w-5' />
                            Student Notes
                        </CardTitle>
                        {!isAdding && (
                            <Button onClick={() => setIsAdding(true)} size='sm'>
                                <IconPlus className='h-4 w-4 mr-2' />
                                Add Note
                            </Button>
                        )}
                    </div>
                </CardHeader>

                {isAdding && (
                    <CardContent className='space-y-4'>
                        <div>
                            <label className='text-sm font-medium mb-2 block'>Note Type</label>
                            <select
                                value={noteType}
                                onChange={(e) => setNoteType(e.target.value as Note['type'])}
                                className='w-full p-2 border rounded-md bg-background'
                            >
                                {noteTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='text-sm font-medium mb-2 block'>Note Content</label>
                            <Textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder='Enter your note here...'
                                rows={4}
                                className='resize-none'
                            />
                        </div>

                        <div className='flex gap-2'>
                            <Button
                                onClick={handleAddNote}
                                disabled={
                                    loading || !newNote || newNote.replace(/^\s+|\s+$/g, '') === ''
                                }
                                size='sm'
                            >
                                {loading ? 'Adding...' : 'Add Note'}
                            </Button>
                            <Button
                                variant='outline'
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewNote('');
                                    setNoteType('GENERAL');
                                }}
                                size='sm'
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Notes List */}
            <div className='space-y-4'>
                {notes.length > 0 ? (
                    notes
                        .sort(
                            (a, b) =>
                                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )
                        .map((note) => (
                            <Card key={note.id}>
                                <CardContent className='pt-6'>
                                    <div className='flex items-start gap-4'>
                                        <Avatar className='h-10 w-10'>
                                            <AvatarImage src='' />
                                            <AvatarFallback>
                                                {getInitials(note.createdBy.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className='flex-1 space-y-2'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium'>
                                                        {note.createdBy.name}
                                                    </span>
                                                    <Badge className={getNoteTypeColor(note.type)}>
                                                        {getNoteTypeLabel(note.type)}
                                                    </Badge>
                                                </div>

                                                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                                    <IconCalendar className='h-4 w-4' />
                                                    {format(
                                                        new Date(note.createdAt),
                                                        'MMM d, yyyy h:mm a'
                                                    )}
                                                </div>
                                            </div>

                                            <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                                                {note.content}
                                            </p>

                                            {note.updatedAt !== note.createdAt && (
                                                <p className='text-xs text-muted-foreground'>
                                                    Last edited:{' '}
                                                    {format(
                                                        new Date(note.updatedAt),
                                                        'MMM d, yyyy h:mm a'
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <div className='flex gap-1'>
                                            <Button size='sm' variant='ghost'>
                                                <IconEdit className='h-4 w-4' />
                                            </Button>
                                            <Button size='sm' variant='ghost'>
                                                <IconTrash className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                ) : (
                    <Card>
                        <CardContent className='py-12'>
                            <div className='text-center text-muted-foreground'>
                                <IconNote className='h-12 w-12 mx-auto mb-4 opacity-50' />
                                <p className='text-lg font-medium mb-2'>No notes yet</p>
                                <p className='text-sm'>
                                    Add the first note about this student to keep track of important
                                    information.
                                </p>
                                {!isAdding && (
                                    <Button
                                        onClick={() => setIsAdding(true)}
                                        className='mt-4'
                                        variant='outline'
                                    >
                                        <IconPlus className='h-4 w-4 mr-2' />
                                        Add First Note
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Note Guidelines */}
            <Card>
                <CardHeader>
                    <CardTitle>Note Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3 text-sm text-muted-foreground'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <h4 className='font-medium text-foreground mb-2'>Note Types:</h4>
                                <ul className='space-y-1'>
                                    <li>
                                        <strong>General:</strong> General observations and comments
                                    </li>
                                    <li>
                                        <strong>Academic:</strong> Academic performance and progress
                                    </li>
                                    <li>
                                        <strong>Behavioral:</strong> Behavioral observations and
                                        incidents
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className='font-medium text-foreground mb-2'>
                                    Additional Types:
                                </h4>
                                <ul className='space-y-1'>
                                    <li>
                                        <strong>Medical:</strong> Health-related information
                                    </li>
                                    <li>
                                        <strong>Parent Contact:</strong> Communication with
                                        parents/guardians
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className='mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg'>
                            <p className='text-amber-800 dark:text-amber-200'>
                                <strong>Privacy Notice:</strong> All notes are confidential and
                                should only contain relevant educational information. Avoid personal
                                opinions or sensitive data.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
