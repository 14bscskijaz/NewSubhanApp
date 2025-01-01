'use client';

import { DatePicker } from './DatePicker';

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
  // Parse the date from the filter value
  const parseDate = (value: string): Date | undefined => {
    if (!value) return undefined;
    try {
      return new Date(value);
    } catch {
      return undefined;
    }
  };

  // Convert selected date to string format for the filter
  const handleSelect = (selectedDate: Date | undefined) => {
    console.log("Handle Selected Date:", selectedDate); // Debugging log
    if (!selectedDate) {
      setFilterValue("");
      return;
    }
    const value = selectedDate.toISOString();
    setFilterValue(value).then(() => {
      console.log("Updated filter value:", value); // Debugging log
    });
  };

  return (
    <div className='inline'>
      <DatePicker
        date={parseDate(filterValue)}
        onChange={handleSelect}
        className='bg-gradient-border'
      />
    </div>
  );
}
