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
    onChange(newDate);  // Pass the selected date to parent component
  };

  // Handle invalid date or undefined case
  const formattedDate = selected && !isNaN(selected.getTime()) ? format(selected, "PPP") : "Pick a date";

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
