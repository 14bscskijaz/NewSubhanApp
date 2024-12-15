"use client";

import { createBus, getAllBuses } from "@/app/actions/bus.action";
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
import { useToast } from "@/hooks/use-toast";
import { Buses, addBus, allBuses, setBus } from "@/lib/slices/bus-slices";
import { RootState } from "@/lib/store";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function NewBusDialog() {
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const [open, setOpen] = useState(false);
  const [busNumber, setBusNumber] = useState("");
  const [busType, setBusType] = useState("");
  const [brand, setBrand] = useState(""); // New field for Brand Name
  const [busOwner, setBusOwner] = useState("");
  const [description, setDescription] = useState("");
  const [busStatus, setBusStatus] = useState("");

  const { toast } = useToast();

  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isBusExist = buses.find(
      (bus) =>
        bus.busNumber.toLowerCase().trim() === busNumber.toLowerCase().trim()
    );
    if (isBusExist) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Bus Number Already Exist",
        duration: 1000,
      });
      return;
    }
    const newBus: Omit<Buses, "id"> = {
      busNumber,
      busType,
      brand,
      busOwner,
      description,
      busStatus,
    };

    try {
      await createBus(newBus);
      const allBusesData = await getAllBuses();
      dispatch(setBus(allBusesData));
      toast({
        title: "Success",
        variant: "default",
        description: "New Bus Created successfully!",
        duration: 1000,
      });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
        duration: 1000,
      });
      console.error("Failed to create the bus:", error.message);
    }
  };

  const resetForm = () => {
    setBusNumber("");
    setBusType("");
    setBrand(""); // Reset brand
    setBusOwner("");
    setDescription("");
    setBusStatus("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Bus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[940px] max-h-[570px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add New <span className="text-gradient">Bus</span>
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new bus here. Click save when you are
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-12 py-8 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="busNumber" className="text-gradient">
                Bus Number
              </Label>
              <Input
                id="busNumber"
                placeholder="Enter Bus Number"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                maxLength={9}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="busType">
                Bus <span className="text-gradient">Type</span>
              </Label>
              <Select onValueChange={setBusType}>
                <SelectTrigger id="busType">
                  <SelectValue placeholder="Select Bus Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* New Brand Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="brand" className="text-gradient">
                Brand
              </Label>
              <Input
                id="brand"
                placeholder="Enter Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                maxLength={50}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="busOwner">
                Bus <span className="text-gradient">Owner</span>
              </Label>
              <Input
                id="busOwner"
                placeholder="Enter Bus Owner"
                value={busOwner}
                onChange={(e) => setBusOwner(e.target.value)}
                maxLength={55}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description" className="text-gradient">
                Description
              </Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="busStatus">
                Bus <span className="text-gradient">Status</span>
              </Label>
              <Select onValueChange={setBusStatus}>
                <SelectTrigger id="busStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Maintenance">
                    Under Maintenance
                  </SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Bus</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
