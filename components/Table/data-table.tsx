'use client';

import * as React from 'react';
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconGripVertical,
    IconFilter
} from '@tabler/icons-react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';

interface FilterOption {
    label: string;
    value: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    enableDragAndDrop?: boolean;
    enableRowSelection?: boolean;
    enablePagination?: boolean;
    enableSearch?: boolean;
    searchPlaceholder?: string;
    pageSize?: number;
    getRowId?: (row: T) => string;
    onCreateNew?: () => void;
    createNewLabel?: string;
    showCreateButton?: boolean;
    onDeleteSelected?: (selectedIds: string[]) => Promise<void>;
    showDeleteButton?: boolean;
    deleteButtonLabel?: string;
    filters?: {
        columnId: string;
        title: string;
        options: FilterOption[];
    }[];
}

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string | number }) {
    const { attributes, listeners } = useSortable({
        id
    });

    return (
        <Button
            {...attributes}
            {...listeners}
            variant='ghost'
            size='icon'
            className='text-muted-foreground size-7 hover:bg-transparent'
        >
            <IconGripVertical className='text-muted-foreground size-3' />
            <span className='sr-only'>Drag to reorder</span>
        </Button>
    );
}

// Helper function to create drag column
export function createDragColumn<T>(getRowId: (row: T) => string): ColumnDef<T> {
    return {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={getRowId(row.original)} />,
        enableSorting: false,
        enableHiding: false
    };
}

// Helper function to create selection column
export function createSelectionColumn<T>(): ColumnDef<T> {
    return {
        id: 'select',
        header: ({ table }) => (
            <div className='flex items-center justify-center'>
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label='Select all'
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className='flex items-center justify-center'>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label='Select row'
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false
    };
}

function DraggableRow<T>({ row, getRowId }: { row: Row<T>; getRowId: (row: T) => string }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: getRowId(row.original)
    });

    return (
        <TableRow
            data-state={row.getIsSelected() && 'selected'}
            data-dragging={isDragging}
            ref={setNodeRef}
            className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}

export function DataTable<T>({
    data: initialData,
    columns,
    enableDragAndDrop = false,
    enableRowSelection = false,
    enablePagination = true,
    enableSearch = true,
    searchPlaceholder = 'Search...',
    pageSize = 10,
    getRowId = (row: T) => (row as any).id?.toString() || Math.random().toString(),
    onCreateNew,
    createNewLabel = 'Create New',
    showCreateButton = false,
    onDeleteSelected,
    showDeleteButton = false,
    deleteButtonLabel = 'Delete Selected',
    filters = []
}: DataTableProps<T>) {
    const [data, setData] = React.useState(() => initialData);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize
    });
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setData(initialData);
        }, 300);

        return () => clearTimeout(timer);
    }, [initialData]);

    const sortableId = React.useId();
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map((row) => getRowId(row)) || [],
        [data, getRowId]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection: enableRowSelection ? rowSelection : {},
            columnFilters,
            globalFilter: enableSearch ? globalFilter : undefined,
            pagination: enablePagination ? pagination : { pageIndex: 0, pageSize: data.length }
        },
        getRowId,
        enableRowSelection,
        enableGlobalFilter: enableSearch,
        globalFilterFn: enableSearch ? 'includesString' : undefined,
        onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: enableSearch ? setGlobalFilter : undefined,
        onPaginationChange: enablePagination ? setPagination : undefined,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues()
    });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }
    }

    const handleDeleteSelected = async () => {
        if (!onDeleteSelected) return;

        const selectedRows = table.getFilteredSelectedRowModel().rows;
        const selectedIds = selectedRows.map((row) => getRowId(row.original));

        if (selectedIds.length === 0) return;

        const confirmMessage =
            selectedIds.length === 1
                ? 'Are you sure you want to delete this item?'
                : `Are you sure you want to delete ${selectedIds.length} items?`;

        if (!confirm(confirmMessage)) return;

        try {
            setIsDeleting(true);
            await onDeleteSelected(selectedIds);

            // Remove deleted items from local state
            setData((prevData) => prevData.filter((item) => !selectedIds.includes(getRowId(item))));

            // Clear selection
            setRowSelection({});
        } catch (error) {
            console.error('Failed to delete items:', error);
            alert('Failed to delete items. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const TableContent = () => (
        <Table>
            <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                      )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    enableDragAndDrop ? (
                        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                            {table.getRowModel().rows.map((row) => (
                                <DraggableRow key={row.id} row={row} getRowId={getRowId} />
                            ))}
                        </SortableContext>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className='h-24 text-center'>
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    return (
        <div className='space-y-4'>
            {(enableSearch || showCreateButton || filters.length > 0) && (
                <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                        {enableSearch && (
                            <div className='relative flex-1 max-w-sm'>
                                <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                                <Input
                                    placeholder={searchPlaceholder}
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className='pl-9'
                                />
                            </div>
                        )}
                        {filters.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {filters.map((filter) => {
                                    const column = table.getColumn(filter.columnId);
                                    const selectedValues =
                                        (column?.getFilterValue() as string[]) || [];
                                    const uniqueValues = Array.from(
                                        new Set(data.map((row) => (row as any)[filter.columnId]))
                                    );
                                    const valueCounts = new Map();
                                    data.forEach((row) => {
                                        const value = (row as any)[filter.columnId];
                                        valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
                                    });

                                    const handleFilterChange = (
                                        checked: boolean,
                                        value: string
                                    ) => {
                                        const currentValues = selectedValues || [];
                                        let newValues;
                                        if (checked) {
                                            newValues = [...currentValues, value];
                                        } else {
                                            newValues = currentValues.filter((v) => v !== value);
                                        }
                                        // If no values selected, clear the filter completely
                                        column?.setFilterValue(
                                            newValues.length > 0 ? newValues : undefined
                                        );
                                    };

                                    return (
                                        <Popover key={filter.columnId}>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline'>
                                                    <IconFilter
                                                        className='-ms-1 opacity-60'
                                                        size={16}
                                                        aria-hidden='true'
                                                    />
                                                    <span className='sr-only sm:not-sr-only'>
                                                        {filter.title}
                                                    </span>
                                                    {selectedValues.length > 0 && (
                                                        <span className='bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium'>
                                                            {selectedValues.length}
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className='w-auto min-w-36 p-3'
                                                align='start'
                                            >
                                                <div className='space-y-3'>
                                                    <div className='text-muted-foreground text-xs font-medium'>
                                                        Filters
                                                    </div>
                                                    <div className='space-y-3'>
                                                        {uniqueValues.map((value, i) => (
                                                            <div
                                                                key={value}
                                                                className='flex items-center gap-2'
                                                            >
                                                                <Checkbox
                                                                    id={`${filter.columnId}-${i}`}
                                                                    checked={selectedValues.includes(
                                                                        value
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked: boolean
                                                                    ) =>
                                                                        handleFilterChange(
                                                                            checked,
                                                                            value
                                                                        )
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`${filter.columnId}-${i}`}
                                                                    className='flex grow justify-between gap-2 font-normal'
                                                                >
                                                                    {value}{' '}
                                                                    <span className='text-muted-foreground ms-2 text-xs'>
                                                                        {valueCounts.get(value)}
                                                                    </span>
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        {showDeleteButton &&
                            onDeleteSelected &&
                            enableRowSelection &&
                            Object.keys(rowSelection).length > 0 && (
                                <Button
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    variant='destructive'
                                    className='flex items-center gap-2'
                                >
                                    <IconTrash className='h-4 w-4' />
                                    <span className='sr-only sm:not-sr-only'>
                                        {isDeleting ? 'Deleting...' : deleteButtonLabel}
                                    </span>
                                </Button>
                            )}
                        {showCreateButton && onCreateNew && (
                            <Button onClick={onCreateNew} className='flex items-center gap-2'>
                                <IconPlus className='h-4 w-4' />
                                <span className='sr-only sm:not-sr-only'>{createNewLabel}</span>
                            </Button>
                        )}
                    </div>
                </div>
            )}
            <div className='overflow-hidden rounded-lg border'>
                {enableDragAndDrop ? (
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <TableContent />
                    </DndContext>
                ) : (
                    <TableContent />
                )}
            </div>

            {(enableRowSelection || enablePagination) && (
                <div className='flex items-center justify-between'>
                    <div className='hidden items-center gap-2 lg:flex'>
                        <Label htmlFor='rows-per-page' className='text-sm font-medium'>
                            Rows per page
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side='top'>
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {enablePagination && (
                        <div className='flex w-full items-center gap-8 lg:w-fit'>
                            <div className='flex w-fit items-center justify-center text-sm font-medium'>
                                Page {table.getState().pagination.pageIndex + 1} of{' '}
                                {table.getPageCount()}
                            </div>

                            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
                                <Button
                                    variant='outline'
                                    className='hidden h-8 w-8 p-0 lg:flex'
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className='sr-only'>Go to first page</span>
                                    <IconChevronsLeft />
                                </Button>
                                <Button
                                    variant='outline'
                                    className='size-8'
                                    size='icon'
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className='sr-only'>Go to previous page</span>
                                    <IconChevronLeft />
                                </Button>
                                <Button
                                    variant='outline'
                                    className='size-8'
                                    size='icon'
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className='sr-only'>Go to next page</span>
                                    <IconChevronRight />
                                </Button>
                                <Button
                                    variant='outline'
                                    className='hidden size-8 lg:flex'
                                    size='icon'
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                >
                                    <span className='sr-only'>Go to last page</span>
                                    <IconChevronsRight />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
