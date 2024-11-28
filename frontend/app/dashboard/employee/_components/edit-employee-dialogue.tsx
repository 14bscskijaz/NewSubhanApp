import { useState, useEffect } from "react";
import { Pen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker"; // Ensure this component supports the correct props
import { Employee } from "@/lib/slices/employe-slices";


type EditEmployeeDialogProps = {
  employee: Employee;
  onUpdate: (updatedEmployee: Employee) => void; // Add onUpdate prop
};

export default function EditEmployeeDialog({
  employee,
  onUpdate,
}: EditEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Employee>({
    ...employee,
    hire_date: employee.hire_date ? new Date(employee.hire_date) : new Date(),
    dob: employee.dob ? new Date(employee.dob) : new Date(),
  });

  useEffect(() => {
    setFormData({
      ...employee,
      hire_date: employee.hire_date ? new Date(employee.hire_date) : new Date(),
      dob: employee.dob ? new Date(employee.dob) : new Date(),
    });
  }, [employee]);

  const isValidDate = (date?: Date) => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof Employee, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHireDateChange = (date: Date | undefined) => {
    if (date && isValidDate(date)) {
      setFormData((prev) => ({ ...prev, hireDate: date }));
    } else {
      setFormData((prev) => ({ ...prev, hireDate: new Date() })); // Use current date as fallback
    }
  };

  const handleDobChange = (date: Date | undefined) => {
    if (date && isValidDate(date)) {
      setFormData((prev) => ({ ...prev, dob: date }));
    } else {
      setFormData((prev) => ({ ...prev, dob: new Date() })); // Use current date as fallback
    }
  };

  console.log(employee, "employee");


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="my-2.5 mr-2 cursor-pointer">
          <Pen className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[940px] max-h-[570px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit <span className="text-gradient">Employee</span></DialogTitle>
            <DialogDescription>
              Update the details of the employee and click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-10 py-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cnic" className="text-gradient">CNIC</Label>
              <Input id="cnic" value={formData.cnic} onChange={handleInputChange} placeholder="Enter CNIC" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first_name">First <span className="text-gradient">Name</span></Label>
              <Input id="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Enter first name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last <span className="text-gradient">Name</span></Label>
              <Input id="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Enter last name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employee_type">Employee <span className="text-gradient">Type</span></Label>
              <Select value={formData?.employee_type?.toLowerCase()} onValueChange={(value) => handleSelectChange('employee_type', value)}>
                <SelectTrigger id="employeeType">
                  <SelectValue placeholder="Select employee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="conductor">Conductor</SelectItem>
                  {/* <SelectItem value="contract">Contract</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="address" className="text-gradient">Address</Label>
              <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Enter address" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobile_number">Mobile <span className="text-gradient">Number</span></Label>
              <Input id="mobile_number" value={formData.mobile_number} onChange={handleInputChange} placeholder="Enter mobile number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hire_date">Hire <span className="text-gradient">Date</span></Label>
              <DatePicker
                selected={formData.hire_date || undefined}
                onChange={handleHireDateChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employee_status">Employee <span className="text-gradient">Status</span></Label>
              <Select value={formData.employee_status.toLowerCase()} onValueChange={(value) => handleSelectChange('employee_status', value)}>
                <SelectTrigger id="employee_status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on Leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of <span className="text-gradient">Birth</span></Label>
              <DatePicker
                selected={formData.dob || undefined}
                onChange={handleDobChange} // Now accepts null
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="notes" className="text-gradient">Notes</Label>
              <Textarea id="notes" value={formData.notes} onChange={handleInputChange} rows={3} placeholder="Enter any additional notes" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
