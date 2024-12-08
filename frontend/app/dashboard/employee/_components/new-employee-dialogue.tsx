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

  const dispatch = useDispatch();

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    const mobileRegex = /^\d{4}-\d{7}$/;

    if (!cnicRegex.test(cnic)) {
      alert("Please enter a valid CNIC in the format xxxxx-xxxxxxx-x.");
      return;
    }

    if (!mobileRegex.test(mobileNumber)) {
      alert("Please enter a valid mobile number in the format xxxx-xxxxxxx.");
      return;
    }

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

    // await createEmployee(newEmployee);
    // const getAllEmployee = await getAllEmployees();
    // dispatch(setEmployee(getAllEmployee));
    dispatch(addEmployee(newEmployee));
    setOpen(false);
    resetForm();
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
              Enter the details of the new employee here. Click save when you are
              done.
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
              />
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
              />
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeType">
                Employee <span className="text-gradient">Type</span>
              </Label>
              <Select onValueChange={setEmployeeType}>
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
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
              />
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employeeStatus">
                Employee <span className="text-gradient">Status</span>
              </Label>
              <Select onValueChange={setEmployeeStatus}>
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
              <Label htmlFor="dob">
                Date of <span className="text-gradient">Birth</span>
              </Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="notes" className="text-gradient">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Enter any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
