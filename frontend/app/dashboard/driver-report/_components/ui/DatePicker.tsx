import { format } from "date-fns";
import { CalendarIcon } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

type DatePickerProps = {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
};

export function DatePicker({ date, onChange, className }: DatePickerProps) {
  // Format the date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Pick a date";
    return format(date, "PPP");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          initialFocus
          selected={date}
          onSelect={(selectedDate) => {
            console.log("Selected Date:", selectedDate); // Debugging log
            onChange(selectedDate);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
