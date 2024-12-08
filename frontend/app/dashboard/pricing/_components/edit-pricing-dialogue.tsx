import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { Pen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TicketPriceDisplay } from './pricing-listing-page';

type EditPricingDialogProps = {
  ticket: TicketPriceDisplay;
  onUpdate: (updated: TicketPriceRaw) => void;
};

export default function EditPricingDialog({
  ticket,
  onUpdate
}: EditPricingDialogProps) {
  const routes = useSelector<RootState, Route[]>(allRoutes); // Get all routes from Redux
  const ticketRoutes = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);

  const [busType, setBusType] = useState(ticket.busType);
  const [routeId, setRouteId] = useState<number | undefined>(ticket?.routeId);
  const [formData, setFormData] = useState({
    ...ticket
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFormData({
      ...ticket
    });
    if (!routeId && ticket.routeId) {
      setRouteId(ticket.routeId);
    }
  }, [ticket]);

  // Filter routes based on ticketRaw data (routes that exist in the ticketRaw slice)
  const filteredRoutes = routes.filter(route =>
    ticketRoutes.some(ticket => ticket.routeId === route.id)
  );  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'ticketPrice' ? parseFloat(value) : value
    }));
  };

  const handleRouteChange = (routeId: string) => {
    // Use Number() to ensure proper type for routeId
    const selectedRouteId = Number(routeId);
    setRouteId(selectedRouteId);
    setFormData(prev => ({
      ...prev,
      routeId: selectedRouteId
    }));
  };

  const handleBusTypeChange = (newBusType: string) => {
    setFormData((prev) => ({
      ...prev,
      busType: newBusType,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const updatedFormData = {
      ...formData,
      routeId: formData.routeId !== undefined ? formData.routeId : 0
    };
    console.log(updatedFormData,"updatedFormData");
    
    onUpdate(updatedFormData); // Pass updated data with valid routeId
    setOpen(false);
  };

  return (
    <Dialog open={open} modal={true} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="my-2.5 mr-2 cursor-pointer">
          <Pen className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-[570px] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Ticket Price</DialogTitle>
            <DialogDescription>
              Update the details of the ticket price and click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="routeId">Route</Label>
              <Select value={routeId?.toString()} onValueChange={handleRouteChange}>
                <SelectTrigger id="routeId">
                  <SelectValue placeholder="Select Route" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRoutes.map((route) => (
                    <SelectItem key={route.id} value={String(route.id)}>
                      {route.sourceCity} - {route.destinationCity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ticketPrice">Ticket Price</Label>
              <Input
                id="ticketPrice"
                type="number"
                value={formData.ticketPrice || ''}
                onChange={handleInputChange}
                placeholder="Enter ticket price"
              />
            </div>
            <div className="grid gap-2">
            <Label htmlFor="busType">
              Bus <span className="text-gradient">Type</span>
            </Label>
            <Select
              value={formData.busType}
              onValueChange={handleBusTypeChange}
            >
              <SelectTrigger id="busType">
                <SelectValue placeholder="Select Bus Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Ticket Price</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
