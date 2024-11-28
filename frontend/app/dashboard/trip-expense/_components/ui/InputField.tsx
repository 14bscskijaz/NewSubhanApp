import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputFieldProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (id: string, value: string | number) => void;
  placeholder?: string;
  type?: "text" | "number";
  error?: string;
};

export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error,
}: InputFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-gradient">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(id, type === "number" ? +e.target.value : e.target.value)}
        placeholder={placeholder}
        className={`${error ? "border-red-500" : ""}`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
