import { createTicketPrice, getAllTicketPrices } from "@/app/actions/pricing.action";
import SelectField from "@/components/ui/SelectField";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TicketPriceRaw, setTicketRaw } from "@/lib/slices/pricing-slices";
import { Route, allRoutes } from "@/lib/slices/route-slices";
import { RootState } from "@/lib/store";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function NewPricingDialog() {
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const [open, setOpen] = useState(false);
  const [routeId, setRouteId] = useState<number | "">("");
  const [ticketPrice, setTicketPrice] = useState<number | "">("");
  const [busType, setBusType] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    routeId: "",
    ticketPrice: "",
    busType: "",
  });
  const { toast } = useToast();
  const dispatch = useDispatch();

  const validateForm = () => {
    const errors: typeof validationErrors = { routeId: "", ticketPrice: "", busType: "" };
    if (!routeId) errors.routeId = "Route is required.";
    if (!ticketPrice || ticketPrice <= 0) errors.ticketPrice = "Ticket price must be greater than 0.";
    if (!busType) errors.busType = "Bus type is required.";
    setValidationErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const newTicket: Omit<TicketPriceRaw, "id"> = {
        routeId: Number(routeId),
        ticketPrice: Number(ticketPrice),
        busType,
      };

      await createTicketPrice(newTicket);
      const allTicketData = await getAllTicketPrices();
      dispatch(setTicketRaw(allTicketData));

      toast({
        title: "Success",
        description: "New Ticket Price added successfully",
        variant: "default",
        duration: 1000,
      });

      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  const resetForm = () => {
    setRouteId("");
    setTicketPrice("");
    setBusType("");
    setValidationErrors({ routeId: "", ticketPrice: "", busType: "" });
  };

  const handleRouteChange = (value: string) => {
    setRouteId(Number(value));
    if (value) setValidationErrors((prev) => ({ ...prev, routeId: "" }));
  };

  const handleTicketPriceChange = (value: string) => {
    const price = value === "" ? "" : parseInt(value);
    setTicketPrice(price);
    if (price && price > 0) setValidationErrors((prev) => ({ ...prev, ticketPrice: "" }));
  };

  const handleBusTypeChange = (value: string) => {
    setBusType(value);
    if (value) setValidationErrors((prev) => ({ ...prev, busType: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[400px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add New <span className="text-gradient">Ticket Price</span>
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new Ticket Price here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            {/* Route Dropdown */}
            <SelectField
              id="route"
              label="Select Route"
              value={routeId.toString()}
              onChange={handleRouteChange}
              placeholder="Select Route"
              options={routes.map((route) => ({
                value: route.id.toString(),
                label: `${route.sourceCity} (${route.sourceAdda}) - ${route.destinationCity} (${route.destinationAdda})`,
              }))}
              className="flex-col !items-start !space-x-0"
            />
            {validationErrors.routeId && (
              <p className="text-sm text-red-500">{validationErrors.routeId}</p>
            )}

            {/* Ticket Price Input */}
            <div className="grid gap-2">
              <Label htmlFor="ticketPrice">Ticket Price</Label>
              <Input
                id="ticketPrice"
                placeholder="Enter ticket price"
                type="number"
                value={ticketPrice}
                onChange={(e) => handleTicketPriceChange(e.target.value)}
              />
            </div>
            {validationErrors.ticketPrice && (
              <p className="text-sm text-red-500">{validationErrors.ticketPrice}</p>
            )}

            {/* Bus Type Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="busType">
                Bus <span className="text-gradient">Type</span>
              </Label>
              <Select onValueChange={handleBusTypeChange}>
                <SelectTrigger id="busType">
                  <SelectValue placeholder="Select Bus Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {validationErrors.busType && (
              <p className="text-sm text-red-500">{validationErrors.busType}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save Ticket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
