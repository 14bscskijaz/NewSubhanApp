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
import { Employee } from "@/lib/slices/employe-slices";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";

type EditEmployeeDialogProps = {
  employee: Employee;
  onUpdate: (updatedEmployee: Employee) => void;
};

const formatDate = (date: Date | null): string => {
  if (!date || !(date instanceof Date)) return ""; // Handle invalid or null dates
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function EditEmployeeDialog({
  employee,
  onUpdate,
}: EditEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Employee>({
    ...employee,
    hireDate: employee.hireDate ? new Date(employee.hireDate) : null,
    dob: employee.dob ? new Date(employee.dob) : null,
  });

  useEffect(() => {
    setFormData({
      ...employee,
      hireDate: employee.hireDate ? new Date(employee.hireDate) : null,
      dob: employee.dob ? new Date(employee.dob) : null,
    });
  }, [employee]);

  const isValidDate = (date?: Date) => date instanceof Date && !isNaN(date.getTime());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: keyof Employee, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: keyof Employee, value: string) => {
    const date = value ? new Date(value) : null; // Parse or set to null
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate(formData);
    setOpen(false);
  };

  const formatCNIC = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length <= 13) {
      return cleanedValue.replace(/(\d{5})(\d{7})(\d{1})/, "$1-$2-$3");
    }
    return cleanedValue.slice(0, 13).replace(/(\d{5})(\d{7})(\d{1})/, "$1-$2-$3");
  };

  const formatMobileNumber = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length <= 10) {
      return cleanedValue.replace(/(\d{4})(\d{7})/, "$1-$2");
    }
    return cleanedValue.slice(0, 11).replace(/(\d{4})(\d{7})/, "$1-$2");
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
            <DialogTitle>
              Edit <span className="text-gradient">Employee</span>
            </DialogTitle>
            <DialogDescription>
              Update the details of the employee and click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-10 py-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cnic" className="text-gradient">CNIC</Label>
              <Input
                id="cnic"
                value={formatCNIC(formData.cnic)}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                placeholder="Enter CNIC"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstName">First <span className="text-gradient">Name</span></Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last <span className="text-gradient">Name</span></Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeType">Employee <span className="text-gradient">Type</span></Label>
              <Select
                value={formData.employeeType}
                onValueChange={(value) => handleSelectChange("employeeType", value)}
              >
                <SelectTrigger id="employeeType">
                  <SelectValue placeholder="Select employee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="Conductor">Conductor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="address" className="text-gradient">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobileNumber">Mobile <span className="text-gradient">Number</span></Label>
              <Input
                id="mobileNumber"
                value={formatMobileNumber(formData.mobileNumber)}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="Enter mobile number"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hireDate">Hire <span className="text-gradient">Date</span></Label>
              <Input
                id="hireDate"
                type="date"
                value={formatDate(formData.hireDate)}
                onChange={(e) => handleDateChange("hireDate", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeStatus">Employee <span className="text-gradient">Status</span></Label>
              <Select
                value={formData.employeeStatus}
                onValueChange={(value) => handleSelectChange("employeeStatus", value)}
              >
                <SelectTrigger id="employeeStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of <span className="text-gradient">Birth</span></Label>
              <Input
                id="dob"
                type="date"
                value={formatDate(formData.dob)}
                onChange={(e) => handleDateChange("dob", e.target.value)}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="notes" className="text-gradient">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter any additional notes"
              />
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
