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
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [loading, setLoading] = useState(false); // Loading state to track form submission

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    // Validation
    const errors: any = {};

    if (!formData.firstName) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!formData.cnic || formData.cnic.length !== 15) {
      errors.cnic = "Invalid CNIC format";
    }

    if (!formData.mobileNumber) {
      errors.mobileNumber = "Invalid mobile number format";
    }

    if (!formData.hireDate || !isValidDate(formData.hireDate)) {
      errors.hireDate = "Invalid hire date";
    }

    if (!formData.dob || !isValidDate(formData.dob)) {
      errors.dob = "Invalid date of birth";
    }

    if (!formData.employeeStatus) {
      errors.employeeStatus = "Employee status is required";
    }

    if (!formData.employeeType) {
      errors.employeeType = "Employee type is required";
    }

    setValidationErrors(errors);

    // If no errors, proceed with the update
    if (Object.keys(errors).length === 0) {
      await onUpdate(formData); // Simulate async operation
      setOpen(false);
    }

    setLoading(false); // Reset loading state after submission
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
                disabled={loading} // Disable input during loading
              />
              {validationErrors.cnic && <p className="text-red-500 text-sm">{validationErrors.cnic}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstName">First <span className="text-gradient">Name</span></Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                disabled={loading} // Disable input during loading
              />
              {validationErrors.firstName && <p className="text-red-500 text-sm">{validationErrors.firstName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last <span className="text-gradient">Name</span></Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                disabled={loading} // Disable input during loading
              />
              {validationErrors.lastName && <p className="text-red-500 text-sm">{validationErrors.lastName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeType">Employee <span className="text-gradient">Type</span></Label>
              <Select
                value={formData.employeeType}
                onValueChange={(value) => handleSelectChange("employeeType", value)}
                disabled={loading} // Disable select during loading
              >
                <SelectTrigger id="employeeType">
                  <SelectValue placeholder="Select employee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="Conductor">Conductor</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.employeeType && <p className="text-red-500 text-sm">{validationErrors.employeeType}</p>}
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="address" className="text-gradient">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                disabled={loading} // Disable input during loading
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobileNumber">Mobile <span className="text-gradient">Number</span></Label>
              <Input
                id="mobileNumber"
                value={formatMobileNumber(formData.mobileNumber)}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="Enter mobile number"
                disabled={loading} // Disable input during loading
              />
              {validationErrors.mobileNumber && <p className="text-red-500 text-sm">{validationErrors.mobileNumber}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hireDate">Hire <span className="text-gradient">Date</span></Label>
              <Input
                id="hireDate"
                type="date"
                value={formatDate(formData.hireDate)}
                onChange={(e) => handleDateChange("hireDate", e.target.value)}
                disabled={loading} // Disable input during loading
              />
              {validationErrors.hireDate && <p className="text-red-500 text-sm">{validationErrors.hireDate}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeStatus">Employee <span className="text-gradient">Status</span></Label>
              <Select
                value={formData.employeeStatus}
                onValueChange={(value) => handleSelectChange("employeeStatus", value)}
                disabled={loading} // Disable select during loading
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
              {validationErrors.employeeStatus && <p className="text-red-500 text-sm">{validationErrors.employeeStatus}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}> {/* Disable button during loading */}
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
