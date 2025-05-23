'use client';

import { DateRange } from "react-day-picker"
import { DateRangePicker } from './DatePicker';

interface DateFilterProps {
  filterKey: string;
  title: string;
  filterValue: string | null;
  setFilterValue: (value: string) => Promise<URLSearchParams>;
}

export function DateFilterBox({
  filterKey,
  title,
  filterValue,
  setFilterValue,
}: DateFilterProps) {
  // Parse the date range from the filter value
  const parseDateRange = (value: string | null): DateRange | undefined => {
    if (!value) return undefined;
    try {
      const [from, to] = value.split('|');
      return {
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      };
    } catch {
      return undefined;
    }
  };

  // Convert date range to string format for the filter
  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      setFilterValue("");
      return;
    }
    const value = `${range.from?.toISOString() || ''}|${range.to?.toISOString() || ''}`;
    // const value = `${range.from?.toISOString().split('T')[0] || ''}|${range.to?.toISOString().split('T')[0] || ''}`;
    setFilterValue(value);
  };

  return (
    <div className='inline'>
      <DateRangePicker
        date={parseDateRange(filterValue)}
        setDate={handleSelect}
        className='border border-primary rounded-md hover:bg-accent'
      />
    </div>
  );
}