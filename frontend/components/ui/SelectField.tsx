"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "./input";

type ComboboxProps = {
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
    placeholder: string;
    options: option[];
    label: string;
    className?:any;
};
type option = {
    value: string | number;
    label: string;
}

export default function SelectField({
    id,
    value,
    onChange,
    placeholder,
    options,
    label,
    className
}: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className={`flex text-nowrap items-center space-x-3 ${className}`}>
            <label htmlFor={id} className="text-sm font-medium text-gradient text-gray-700">
                {label}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between overflow-hidden"
                    >
                        {value
                            ? options.find((option) => option.value === value)?.label
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full  p-0 !z-50">
                    <Command>
                        <Input
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="h-9"
                        />

                        <CommandList>
                            <CommandEmpty>No options found.</CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option:option) => (
                                    <CommandItem
                                    className="group"
                                        key={option.value}
                                        value={option.value.toString()}
                                        onSelect={(selectedValue: string) => {
                                            onChange(selectedValue);
                                            setQuery("")
                                            setOpen(false);
                                        }}
                                    >
                                        {option.label}
                                        <Check
                                            className={cn(
                                                "ml-auto text-gradient group-hover:text-gradient-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
