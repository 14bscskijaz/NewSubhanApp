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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { FixedTripExpense } from '@/lib/slices/fixed-trip-expense';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { Pen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { InputField } from '../_components/ui/InputField';
import { Input } from '@/components/ui/input';

type EditTripDialogProps = {
  trip: FixedTripExpense;
  onUpdate: (updatedRoute: FixedTripExpense) => void;
};

export default function EditTripDialog({
  trip,
  onUpdate
}: EditTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ ...trip });
  const [driverCommission, setDriverCommission] = useState('');
  const [isPercentage, setIsPercentage] = useState(true);

  useEffect(() => {
    setFormData({ ...trip });
  }, [trip]);

  const routes = useSelector<RootState, Route[]>(allRoutes);
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);

  // Filter routes that exist in ticketsRaw
  const filteredRoutes = routes.filter((route) =>
    ticketsRaw.some((ticket) => ticket.routeId === route.id)
  );

  const handleDriverCommissionChange = (value: string) => {
    if (isPercentage) {
      // Ensure value is between 0 and 100 when percentage is selected
      if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
        setDriverCommission(value);
      }
    } else {
      // Allow any numeric value when not percentage
      setDriverCommission(value);
    }
  };


  const handleInputChange = (id: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRouteChange = (routeId: number) => {
    setFormData((prev) => ({ ...prev, routeId }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedFormData = {
      ...formData,
      driverCommission: Number(driverCommission),
      isPercentage
    };

    onUpdate(updatedFormData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="my-2.5 mr-2 cursor-pointer">
          <Pen className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-[570px] overflow-y-auto sm:max-w-[940px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>
              Update the details of the trip and click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-10 py-4 md:grid-cols-2">
            {/* Route Selection */}
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="route" className="text-gradient">
                Route
              </Label>
              <Select
                value={formData.routeId?.toString() || trip.routeId.toString()} // Bind the selected value
                onValueChange={(value) => handleRouteChange(Number(value))} // Update state on selection
              >
                <SelectTrigger id="route">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRoutes.map((route) => (
                    <SelectItem key={route.id} value={`${route.id}`}>
                      {`${route.sourceCity} (${route.sourceAdda})`} -{' '}
                      {`${route.destinationCity} (${route.destinationAdda})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reusable Input Fields */}
            <InputField
              id="routeCommission"
              label="Route Commission"
              type="number"
              value={formData.routeCommission.toString() || ''}
              onChange={handleInputChange}
              placeholder="Enter route commission"
            />
            <InputField
              id="rewardCommission"
              label="Reward Commission"
              type="number"
              value={formData.rewardCommission.toString() || ''}
              onChange={handleInputChange}
              placeholder="Enter reward commission"
            />
            <InputField
              id="steward"
              label="Steward"
              type="number"
              value={formData.steward.toString() || ''}
              onChange={handleInputChange}
              placeholder="Enter steward amount"
            />
            <InputField
              id="counter"
              label="Counter (Salary)"
              type="number"
              value={formData.counter.toString() || ''}
              onChange={handleInputChange}
              placeholder="Enter counter salary"
            />
            <InputField
              id="dcParchi"
              label="DC Parchi (Fsd Only)"
              type="number"
              value={formData.dcParchi.toString() || ''}
              onChange={handleInputChange}
              placeholder="Enter DC Parchi"
            />
            <InputField
              id="refreshment"
              label="Refreshment"
              type="number"
              value={formData.refreshment.toString() || ''}
              onChange={handleInputChange}
              placeholder="Enter refreshment amount"
            />
             <div className="grid gap-2">
              <Label htmlFor="driverCommission" className="text-gradient">
                Driver Commission
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="driverCommission"
                  type="number"
                  placeholder={
                    isPercentage
                      ? 'Enter Driver Commission (max 100)'
                      : 'Enter Driver Commission'
                  }
                  value={driverCommission}
                  onChange={(e) => handleDriverCommissionChange(e.target.value)}
                />
                <Select
                  onValueChange={(value) => {
                    setIsPercentage(value === 'true');
                    setDriverCommission(''); // Reset commission when type changes
                  }}
                  defaultValue={isPercentage.toString()}
                >
                  <SelectTrigger id="isPercentage" className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">%</SelectItem>
                    <SelectItem value="false">#</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button type="submit">Update Trip</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
