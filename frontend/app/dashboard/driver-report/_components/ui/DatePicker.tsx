"use client"

import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DateRangePickerProps = {
  date: DateRange | undefined
  onChange: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({ date, onChange, className }: DateRangePickerProps) {
  // Format the date range for display
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range) return "Select dates"
    
    const { from, to } = range
    if (!from) return "Select dates"
    
    if (!to) return format(from, "PPP")
    
    return `${format(from, "PPP")} - ${format(to, "PPP")}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

