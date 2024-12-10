import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type InputFieldProps = {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
};

export default function InputField({ id, value, onChange, placeholder, label }: InputFieldProps) {
  return (
    <div className="flex items-center space-x-3 text-nowrap">
      <Label htmlFor={id} className="text-gradient text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className="max-w-[550px] p-2 rounded-md border"
        placeholder={placeholder}
      />
    </div>
  );
}
