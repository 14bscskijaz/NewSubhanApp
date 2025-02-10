'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import React from 'react';

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterBoxProps {
  filterKey: string;
  title: string;
  options: FilterOption[];
  setFilterValue: any;
  filterValue: any;
}

export function DataTableFilterBoxView({
  filterKey,
  title,
  options,
  setFilterValue,
  filterValue,
}: FilterBoxProps) {
  const handleSelect = (value: string) => {
    let updatedFilters;
    if (filterValue.includes(value)) {
      updatedFilters = filterValue.filter((v:any) => v !== value);
    } else {
      updatedFilters = [...filterValue, value];
    }
    setFilterValue(updatedFilters.length > 0 ? updatedFilters : null);
  };

  const resetFilter = () => setFilterValue(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-gradient-border">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {filterValue && filterValue?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4 bg-gradient-2" />
              <div className="flex flex-wrap gap-1">
                {filterValue && filterValue?.map((val:any) => (
                  <Badge
                    key={val}
                    variant="default"
                    className="rounded-sm text-white bg-gradient-2 py-1 px-1 font-normal"
                  >
                    {options.find((option) => option.value === val)?.label}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title}`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary',
                      filterValue.includes(option.value)
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  {option.icon && (
                    <option.icon
                      className="mr-2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {filterValue?.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={resetFilter}
                    className="justify-center text-center"
                  >
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
