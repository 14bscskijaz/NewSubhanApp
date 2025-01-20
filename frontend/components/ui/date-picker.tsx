"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  selected: Date | undefined
  onChange: (date: Date | undefined) => void
  className?: string
}

export function DatePicker({ selected, onChange, className }: DatePickerProps) {
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Convert to UTC and set time to midnight UTC to avoid local time zone issues
      const utcDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));
      onChange(utcDate); // Pass the UTC date to the parent component
    } else {
      onChange(undefined); // In case no date is selected
    }
  };

  // Handle invalid date or undefined case
  const formattedDate = selected && !isNaN(selected.getTime())
    ? format(selected, "PPP") // Format the date to display it
    : "Pick a date";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
