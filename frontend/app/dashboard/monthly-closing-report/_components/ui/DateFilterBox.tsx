'use client';

import {MonthPicker} from './DatePicker';

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
  const parseDate = (value: string): Date  => {
    if (!value) return new Date();
    try {
      return new Date(value);
    } catch {
      return new Date();
    }
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      setFilterValue("");
      return;
    }
    setFilterValue(date.toISOString());
  };

  return (
    <div className="">
      <MonthPicker
        currentMonth={parseDate(filterValue)}
        onMonthChange={handleSelect}
      />
    </div>
  );
}
