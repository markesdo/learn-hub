'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function ResourceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  // Debounced search with 300ms delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (searchValue.trim()) {
        params.set('search', searchValue.trim());
      } else {
        params.delete('search');
      }
      
      router.push(`/resources?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, router, searchParams]);

  const handleTypeChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value && value !== 'all') {
      params.set('type', value);
    } else {
      params.delete('type');
    }
    
    router.push(`/resources?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  const handleClearAll = useCallback(() => {
    setSearchValue('');
    router.push('/resources', { scroll: false });
  }, [router]);

  const hasActiveFilters = searchParams.get('search') || searchParams.get('type');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search resources..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={searchParams.get('type') || 'all'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

