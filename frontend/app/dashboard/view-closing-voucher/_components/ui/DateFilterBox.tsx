'use client';

import { DatePicker } from '@/components/ui/date-picker'; // Adjust import path as needed

interface DateFilterProps {
  filterKey: string;
  title: string;
  filterValue: string;
  setFilterValue: (value: string) => Promise<URLSearchParams>;
}

export function DateFilterBox({
  filterKey,
  title,
  filterValue,
  setFilterValue,
}: DateFilterProps) {
  const handleSelect = (date: Date | undefined) => {
    date && setFilterValue(date?.toISOString());
  };


  return (
    <div className='inline'>
      <DatePicker
        selected={new Date(filterValue)}
        onChange={handleSelect}
        className='bg-gradient-border'
      />
    </div>
  );
}
