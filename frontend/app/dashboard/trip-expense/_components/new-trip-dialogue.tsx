import { createFixedTripExpense, getAllFixedTripExpenses } from '@/app/actions/FixedTripExpense.action';
import SelectField from '@/components/ui/SelectField';
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
import { useToast } from '@/hooks/use-toast';
import { FixedTripExpense, addFixedTripExpense, setFixedTripExpense } from '@/lib/slices/fixed-trip-expense';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NewTripDialog() {
  const [open, setOpen] = useState(false);
  const [routeId, setRouteId] = useState<string | ''>('');
  const [routeError, setRouteError] = useState<string | null>(null); // Track route validation error
  const [routeCommission, setRouteCommission] = useState<number | ''>('');
  const [rewardCommission, setRewardCommission] = useState<number | ''>('');
  const [steward, setSteward] = useState<number | ''>('');
  const [counter, setCounter] = useState<number | ''>('');
  const [dcParchi, setDcParchi] = useState<number | ''>('');
  const [refreshment, setRefreshment] = useState<number | ''>('');
  const [isPercentage, setIsPercentage] = useState<boolean>(true);
  const { toast } = useToast();

  const dispatch = useDispatch();

  const routes = useSelector<RootState, Route[]>(allRoutes);
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);

  const filteredRoutes = routes.filter((route) =>
    ticketsRaw.some((ticket) => ticket.routeId === route.id)
  );

  const handleRouteChange = (selectedRouteId: string) => {
    setRouteId(selectedRouteId);
    if (selectedRouteId) {
      setRouteError(null); 
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate route
    if (!routeId) {
      setRouteError("Please select a route.");
      return;
    }

    try {
      const filterRouteCommission = isPercentage ? Number(routeCommission) / 100 : Number(routeCommission);
      const newTrip = {
        routeId: Number(routeId) ?? 0,
        routeCommission: filterRouteCommission,
        rewardCommission: Number(rewardCommission),
        steward: Number(steward),
        counter: Number(counter),
        dcParchi: Number(dcParchi),
        refreshment: Number(refreshment),
      };

      await createFixedTripExpense(newTrip);
      const fixedExpenses = await getAllFixedTripExpenses();
      dispatch(setFixedTripExpense(fixedExpenses));

      toast({
        title: "Success",
        description: "New Fixed Trip Expense added successfully.",
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
        duration: 1000,
      });
    }
  };

  const resetForm = () => {
    setRouteId('');
    setRouteCommission('');
    setRewardCommission('');
    setSteward('');
    setCounter('');
    setDcParchi('');
    setRefreshment('');
    setIsPercentage(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Trip Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-[600px] overflow-y-auto sm:max-w-[900px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add New <span className="text-gradient">Trip Expense</span>
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new Trip Expense here. Click save when
              you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-12 py-6 md:grid-cols-2">
            {/* Route Selection */}
            <div>
              <SelectField
                label='Select Route'
                id="route"
                value={routeId}
                onChange={handleRouteChange}
                placeholder="Select Route"
                options={filteredRoutes.map((route) => ({
                  value: route.id.toString(),
                  label: `${route.sourceCity} (${route.sourceAdda}) - ${route.destinationCity} (${route.destinationAdda})`,
                }))}
                className="flex-col !items-start !space-x-0"
              />
              {routeError && <p className="text-red-500 text-sm">{routeError}</p>}
            </div>
            {/* Route Commission */}
            {/* <div className="grid gap-2">
              <Label htmlFor="routeCommission" className="text-gradient">
                Route Commission
              </Label>
              <Input
                id="routeCommission"
                type="number"
                placeholder="Enter Route Commission"
                value={routeCommission}
                onChange={(e) =>
                  setRouteCommission(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div> */}
            {/* Other Inputs */}
            <div className="grid gap-2">
              <Label htmlFor="rewardCommission" className="text-gradient">
                Reward Commission
              </Label>
              <Input
                id="rewardCommission"
                type="number"
                placeholder="Enter Reward Commission"
                value={rewardCommission}
                onChange={(e) =>
                  setRewardCommission(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="steward" className="text-gradient">
                Steward
              </Label>
              <Input
                id="steward"
                type="number"
                placeholder="Enter Steward"
                value={steward}
                onChange={(e) =>
                  setSteward(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="counter" className="text-gradient">
                Counter
              </Label>
              <Input
                id="counter"
                type="number"
                placeholder="Enter Counter"
                value={counter}
                onChange={(e) =>
                  setCounter(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dcParchi" className="text-gradient">
                DC Parchi
              </Label>
              <Input
                id="dcParchi"
                type="number"
                placeholder="Enter DC Parchi"
                value={dcParchi}
                onChange={(e) =>
                  setDcParchi(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="refreshment" className="text-gradient">
                Refreshment
              </Label>
              <Input
                id="refreshment"
                type="number"
                placeholder="Enter Refreshment"
                value={refreshment}
                onChange={(e) =>
                  setRefreshment(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            {/* Driver Commission */}
            <div className="grid gap-2">
              <Label htmlFor="standCommission" className="text-gradient">
                Stand Commission
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="standCommission"
                  type="number"
                  placeholder={
                    isPercentage
                      ? "Enter Stand Commission (max 100)"
                      : "Enter Stand Commission"
                  }
                  value={routeCommission}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isPercentage) {
                      if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
                        setRouteCommission(Number(value));
                      }
                    } else {
                      // If not percentage, allow any value
                      setRouteCommission(Number(value));
                    }
                  }}
                />
                <Select
                  onValueChange={(value) => {
                    setIsPercentage(value === "true");
                    setRouteCommission("");
                  }}
                  defaultValue={isPercentage.toString()}
                >
                  <SelectTrigger id="isPercentage" className="w-20 text-gradient">
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
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

