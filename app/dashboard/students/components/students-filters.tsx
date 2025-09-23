'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconFilter, IconSearch, IconX, IconRefresh } from '@tabler/icons-react';
import { useCallback, useTransition } from 'react';

interface StudentsFiltersProps {
  totalStudents: number;
  filteredCount: number;
  uniqueClasses: string[];
  uniqueBatches: string[];
  uniqueSections: string[];
  currentFilters: {
    search: string;
    class: string;
    status: string;
    batch: string;
    gender: string;
    section: string;
  };
}

export function StudentsFilters({
  totalStudents,
  filteredCount,
  uniqueClasses,
  uniqueBatches,
  uniqueSections,
  currentFilters,
}: StudentsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }, [router, searchParams]);

  const clearAllFilters = useCallback(() => {
    startTransition(() => {
      router.push('/dashboard/students');
    });
  }, [router]);

  const hasActiveFilters = Object.values(currentFilters).some(
    (value, index) => index === 0 ? value !== '' : value !== 'all'
  );

  const activeFilterCount = Object.entries(currentFilters).filter(
    ([key, value]) => key === 'search' ? value !== '' : value !== 'all'
  ).length;

  return (
    <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <IconFilter className="h-4 w-4 text-blue-600" />
            </div>
            <span>Advanced Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-blue-600">{filteredCount}</span> of{' '}
              <span className="font-semibold">{totalStudents}</span> students
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                disabled={isPending}
                className="gap-2"
              >
                <IconRefresh className="h-3 w-3" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or father's name..."
            value={currentFilters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 pr-10 h-11 border-2 focus:border-blue-500"
            disabled={isPending}
          />
          {currentFilters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilter('search', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              disabled={isPending}
            >
              <IconX className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Selects */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Class</label>
            <Select
              value={currentFilters.class}
              onValueChange={(value) => updateFilter('class', value)}
              disabled={isPending}
            >
              <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Section</label>
            <Select
              value={currentFilters.section}
              onValueChange={(value) => updateFilter('section', value)}
              disabled={isPending}
            >
              <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {uniqueSections.map((section) => (
                  <SelectItem key={section} value={section}>
                    Section {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Batch</label>
            <Select
              value={currentFilters.batch}
              onValueChange={(value) => updateFilter('batch', value)}
              disabled={isPending}
            >
              <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {uniqueBatches.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select
              value={currentFilters.status}
              onValueChange={(value) => updateFilter('status', value)}
              disabled={isPending}
            >
              <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="INACTIVE">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Inactive
                  </div>
                </SelectItem>
                <SelectItem value="DISABLED">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Disabled
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <Select
              value={currentFilters.gender}
              onValueChange={(value) => updateFilter('gender', value)}
              disabled={isPending}
            >
              <SelectTrigger className="h-11 border-2 focus:border-blue-500">
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {currentFilters.search && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Search: {currentFilters.search}
                  <IconX
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('search', '')}
                  />
                </Badge>
              )}
              {currentFilters.class !== 'all' && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Class: {currentFilters.class}
                  <IconX
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('class', 'all')}
                  />
                </Badge>
              )}
              {currentFilters.section !== 'all' && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Section: {currentFilters.section}
                  <IconX
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('section', 'all')}
                  />
                </Badge>
              )}
              {currentFilters.batch !== 'all' && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Batch: {currentFilters.batch}
                  <IconX
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('batch', 'all')}
                  />
                </Badge>
              )}
              {currentFilters.status !== 'all' && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Status: {currentFilters.status}
                  <IconX
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('status', 'all')}
                  />
                </Badge>
              )}
              {currentFilters.gender !== 'all' && (
                <Badge variant="secondary" className="gap-1 px-3 py-1">
                  Gender: {currentFilters.gender}
                  <IconX
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => updateFilter('gender', 'all')}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}