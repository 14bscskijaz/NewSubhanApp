import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SelectFieldProps = {
    id: string;
    value: string | undefined;
    onChange: (value: string) => void;
    placeholder: string;
    options: { value: string | number; label: string }[];
    label: string;
};

export default function SelectField({ id, value, onChange, placeholder, options, label }: SelectFieldProps) {
    return (
        <div className="flex items-center space-x-3 text-nowrap">
            <label htmlFor={id} className="text-gradient text-sm font-medium">
                {label}
            </label>
            <Select onValueChange={onChange}>
                <SelectTrigger id={id} className="w-[300px]">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
