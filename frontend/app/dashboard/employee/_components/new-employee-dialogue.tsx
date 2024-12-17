"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
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
import { Employee, addEmployee, setEmployee } from "@/lib/slices/employe-slices";
import { createEmployee, getAllEmployees } from "@/app/actions/employee.action";
import { useToast } from "@/hooks/use-toast";

export default function NewEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [cnic, setCnic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [hireDate, setHireDate] = useState<string>("");
  const [employeeStatus, setEmployeeStatus] = useState("");
  const [dob, setDob] = useState<string>("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const dispatch = useDispatch();

  const [validationErrors, setValidationErrors] = useState<any>({});
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle CNIC formatting
  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value
      .replace(/\D/g, "") // Remove non-numeric characters
      .replace(/(\d{5})(\d{7})(\d{1})/, "$1-$2-$3") // Format as xxxxx-xxxxxxx-x
      .slice(0, 15); // Limit to 15 characters
    setCnic(formattedValue);
  };

  // Handle mobile number formatting
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = value
      .replace(/\D/g, "") // Remove non-numeric characters
      .replace(/(\d{4})(\d{7})/, "$1-$2") // Format as xxxx-xxxxxxx
      .slice(0, 12); // Limit to 12 characters
    setMobileNumber(formattedValue);
  };

  const validateForm = () => {
    const errors: any = {};
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    const mobileRegex = /^\d{4}-\d{7}$/;

    if (!cnicRegex.test(cnic)) {
      errors.cnic = "Please enter a valid CNIC in the format xxxxx-xxxxxxx-x.";
    }

    if (!mobileRegex.test(mobileNumber)) {
      errors.mobileNumber = "Please enter a valid mobile number in the format xxxx-xxxxxxx.";
    }

    if (!firstName) {
      errors.firstName = "First name is required.";
    }

    if (!lastName) {
      errors.lastName = "Last name is required.";
    }

    if (!employeeType) {
      errors.employeeType = "Employee type is required.";
    }

    if (!hireDate) {
      errors.hireDate = "Hire date is required.";
    }

    if (!employeeStatus) {
      errors.employeeStatus = "Employee status is required.";
    }

    if (!dob) {
      errors.dob = "Date of birth is required.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const isValid = validateForm();
      if (!isValid) return;

      setLoading(true); // Set loading to true before starting submission

      const newEmployee: Omit<Employee, "id"> = {
        cnic,
        firstName,
        lastName,
        employeeType,
        address,
        mobileNumber,
        hireDate: hireDate ? new Date(hireDate) : null,
        employeeStatus,
        dob: dob ? new Date(dob) : null,
        notes,
      };

      await createEmployee(newEmployee);
      const getAllEmployee = await getAllEmployees();
      dispatch(setEmployee(getAllEmployee));
      toast({
        title: "Success",
        description: "Employee created successfully",
        variant: "default",
        duration: 1000,
      });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  const resetForm = () => {
    setCnic("");
    setFirstName("");
    setLastName("");
    setEmployeeType("");
    setAddress("");
    setMobileNumber("");
    setHireDate("");
    setEmployeeStatus("");
    setDob("");
    setNotes("");
    setValidationErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[940px] max-h-[570px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add New <span className="text-gradient">Employee</span>
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new employee here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-12 py-8 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cnic" className="text-gradient">CNIC</Label>
              <Input
                id="cnic"
                placeholder="xxxxx-xxxxxxx-x"
                value={cnic}
                onChange={handleCnicChange}
                disabled={loading} // Disable input on loading
              />
              {validationErrors.cnic && <p className="text-red-500 text-sm">{validationErrors.cnic}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstName">
                First <span className="text-gradient">Name</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading} // Disable input on loading
              />
              {validationErrors.firstName && <p className="text-red-500 text-sm">{validationErrors.firstName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">
                Last <span className="text-gradient">Name</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading} // Disable input on loading
              />
              {validationErrors.lastName && <p className="text-red-500 text-sm">{validationErrors.lastName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeType">
                Employee <span className="text-gradient">Type</span>
              </Label>
              <Select onValueChange={setEmployeeType} disabled={loading}> {/* Disable select on loading */}
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
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading} // Disable input on loading
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mobileNumber">
                Mobile <span className="text-gradient">Number</span>
              </Label>
              <Input
                id="mobileNumber"
                placeholder="xxxx-xxxxxxx"
                value={mobileNumber}
                onChange={handleMobileNumberChange}
                disabled={loading} // Disable input on loading
              />
              {validationErrors.mobileNumber && <p className="text-red-500 text-sm">{validationErrors.mobileNumber}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hireDate">
                Hire <span className="text-gradient">Date</span>
              </Label>
              <Input
                id="hireDate"
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                disabled={loading} // Disable input on loading
              />
              {validationErrors.hireDate && <p className="text-red-500 text-sm">{validationErrors.hireDate}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeStatus">
                Employee <span className="text-gradient">Status</span>
              </Label>
              <Select onValueChange={setEmployeeStatus} disabled={loading}> {/* Disable select on loading */}
                <SelectTrigger id="employeeStatus">
                  <SelectValue placeholder="Select employee status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.employeeStatus && <p className="text-red-500 text-sm">{validationErrors.employeeStatus}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of <span className="text-gradient">Birth</span></Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={loading} // Disable input on loading
              />
              {validationErrors.dob && <p className="text-red-500 text-sm">{validationErrors.dob}</p>}
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="notes" className="text-gradient">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading} // Disable textarea on loading
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="" disabled={loading}>
              {loading ? "Submitting..." : "Submit"} {/* Display submitting text */}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
