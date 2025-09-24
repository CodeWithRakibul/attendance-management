import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconEdit, IconTrash, IconDots, IconUser, IconCalendar } from '@tabler/icons-react';

interface NoteCardProps {
  note: {
    id: string;
    note: string;
    createdAt: Date;
    staff: {
      personal: any;
    };
  };
  onEdit: (id: string, note: string) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm leading-relaxed">{note.note}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(note.id, note.note)}>
              <IconEdit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(note.id)}
              className="text-destructive"
            >
              <IconTrash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="my-3" />
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <IconUser className="h-3 w-3" />
          {(note.staff.personal as any)?.nameEn || 'Staff'}
        </div>
        <div className="flex items-center gap-1">
          <IconCalendar className="h-3 w-3" />
          {new Date(note.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}