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
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { Pen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { InputField } from '../_components/ui/InputField';
import { Input } from '@/components/ui/input';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
import SelectField from '@/components/ui/SelectField';

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
  const [driverCommission, setDriverCommission] = useState<any>();
  const [isPercentage, setIsPercentage] = useState(true);
  const [routeError, setRouteError] = useState<string>(''); // State for route validation error

  useEffect(() => {
    setFormData({ ...trip });
  
    // Set the driverCommission and isPercentage based on routeCommission value
    const commissionValue = trip.routeCommission || 0;
    if (commissionValue < 1) {
      setDriverCommission((commissionValue * 100).toString()); // Convert to percentage
      setIsPercentage(true);
    } else {
      setDriverCommission(commissionValue.toString()); // Show as absolute value
      setIsPercentage(false);
    }
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
    setRouteError(''); // Reset error when route is selected
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation for route field
    if (!formData.routeId) {
      setRouteError('Please select a route');
      return; // Prevent form submission if route is not selected
    }

    const filterRouteCommission = isPercentage ? Number(driverCommission) / 100 : Number(driverCommission);
    const updatedFormData = {
      ...formData,
      routeCommission: filterRouteCommission,
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
            <div>
              <SelectField
                label='Select Route'
                id="route"
                value={formData.routeId?.toString() || trip.routeId.toString()} 
                onChange={(value) => handleRouteChange(Number(value))}
                placeholder="Select Route"
                options={filteredRoutes.map((route) => ({
                  value: route.id.toString(),
                  label: `${route.sourceCity} (${route.sourceAdda}) - ${route.destinationCity} (${route.destinationAdda})`,
                }))}
                className="flex-col !items-start !space-x-0"
              />
              {routeError && <p className="text-red-500 text-sm">{routeError}</p>}
            </div>

            {/* Other Input Fields */}
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
              <Label htmlFor="standCommission" className="text-gradient">
                Stand Commission
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="standCommission"
                  type="number"
                  placeholder={isPercentage ? 'Enter Stand Commission (max 100)' : 'Enter Stand Commission'}
                  value={driverCommission}
                  onChange={(e) => handleDriverCommissionChange(e.target.value)}
                />
                <Select
                  onValueChange={(value) => {
                    setIsPercentage(value === 'true');
                    setDriverCommission('');
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
