'use client';

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
import { addTrip } from '@/lib/slices/fixed-trip-expense';
import { RootState } from '@/lib/store';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NewTripDialog() {
  const [open, setOpen] = useState(false);
  const [routeId, setRouteId] = useState<number | ''>(0);
  const [routeCommission, setRouteCommission] = useState<number | ''>('');
  const [rewardCommission, setRewardCommission] = useState<number | ''>('');
  const [steward, setSteward] = useState<number | ''>('');
  const [counter, setCounter] = useState<number | ''>('');
  const [dcParchi, setDcParchi] = useState<number | ''>('');
  const [refreshment, setRefreshment] = useState<number | ''>('');

  const dispatch = useDispatch();

  // Fetch all routes and tickets from the Redux state
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);

  // Filter routes that exist in ticketsRaw
  const filteredRoutes = routes.filter((route) =>
    ticketsRaw.some((ticket) => ticket.routeId === route.id)
  );

  const handleRouteChange = (selectedRouteId: string) => {
    setRouteId(Number(selectedRouteId));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTrip = {
      routeId: routeId,
      routeCommission: Number(routeCommission),
      rewardCommission: Number(rewardCommission),
      steward: Number(steward),
      counter: Number(counter),
      dcParchi: Number(dcParchi),
      refreshment: Number(refreshment)
    };

    dispatch(addTrip(newTrip));
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setRouteId(0);
    setRouteCommission('');
    setRewardCommission('');
    setSteward('');
    setCounter('');
    setDcParchi('');
    setRefreshment('');
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
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="route" className="text-gradient">
                Route
              </Label>
              <Select onValueChange={handleRouteChange}>
                <SelectTrigger id="route">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRoutes.map((route) => (
                    <SelectItem key={route.id} value={`${route.id}`}>
                      {`${route.source} (${route.sourceStation})`} -{' '}
                      {`${route.destination} (${route.destinationStation})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Route Commission */}
            <div className="grid gap-2">
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
            </div>
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
          </div>
          <DialogFooter>
            <Button type="submit">Save Route</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
