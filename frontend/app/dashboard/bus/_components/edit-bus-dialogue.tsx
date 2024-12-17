import { useState, useEffect } from "react";
import { Pen } from "lucide-react";
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
import { Buses } from "@/lib/slices/bus-slices";

type EditBusDialogProps = {
  bus: Buses;
  onUpdate: (updatedBus: Buses, id: number) => void;
};

export default function EditBusDialog({
  bus,
  onUpdate,
}: EditBusDialogProps) {
  const [open, setOpen] = useState(false);
  const [busNumber, setBusNumber] = useState(bus.busNumber || "");
  const [busType, setBusType] = useState(bus.busType || "");
  const [brandName, setBrand] = useState(bus.brandName || "");
  const [busOwner, setBusOwner] = useState(bus.busOwner || "");
  const [description, setDescription] = useState(bus.description || "");
  const [busStatus, setBusStatus] = useState(bus.busStatus || "");
  const [loading, setLoading] = useState(false); // Loading state for form submission

  // Reset form when the bus prop changes
  useEffect(() => {
    setBusNumber(bus.busNumber || "");
    setBusType(bus.busType || "");
    setBrand(bus.brandName || "");
    setBusOwner(bus.busOwner || "");
    setDescription(bus.description || "");
    setBusStatus(bus.busStatus || "");
  }, [bus]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Basic validation to ensure values are not empty
    if (
      !busNumber.trim() ||
      !busType.trim() ||
      !brandName.trim() ||
      !busOwner.trim() ||
      !description.trim() ||
      !busStatus.trim()
    ) {
      return; // Prevent submission if validation fails
    }

    setLoading(true); // Show loading state

    const updatedBus: Buses = {
      id: bus.id,
      busNumber: busNumber.trim(),
      busType: busType.trim(),
      brandName: brandName.trim(),
      busOwner: busOwner.trim(),
      description: description.trim(),
      busStatus: busStatus.trim(),
    };

    // Simulate API call or update process (e.g., delay)
    await onUpdate(updatedBus, bus.id);

    setLoading(false); // Hide loading state after submission
    setOpen(false); // Close the dialog
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
            <DialogTitle>Edit <span className="text-gradient">Bus</span></DialogTitle>
            <DialogDescription>
              Update the details of the bus and click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-10 py-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="busNumber" className="text-gradient">Bus Number</Label>
              <Input
                id="busNumber"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="Enter bus number"
                required
                aria-describedby="busNumber-error"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="busType">Bus <span className="text-gradient">Type</span></Label>
              <Select value={busType} onValueChange={setBusType}>
                <SelectTrigger id="busType">
                  <SelectValue placeholder="Select Bus Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brandName" className="text-gradient">Brand</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter brandName"
                required
                aria-describedby="brandName-error"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="busOwner">Bus <span className="text-gradient">Owner</span></Label>
              <Input
                id="busOwner"
                value={busOwner}
                onChange={(e) => setBusOwner(e.target.value)}
                placeholder="Enter bus owner"
                required
                aria-describedby="busOwner-error"
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description" className="text-gradient">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Enter bus description"
                required
                aria-describedby="description-error"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="busStatus">Bus <span className="text-gradient">Status</span></Label>
              <Select value={busStatus} onValueChange={setBusStatus}>
                <SelectTrigger id="busStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Bus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
