'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
  FixedTripExpense,
  allFixedTripExpenses
} from '@/lib/slices/fixed-trip-expense';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import {
  TripInformation,
  TripInformationInput
} from '@/lib/slices/trip-information';
import { RootState } from '@/lib/store';
import { Pen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

type EditRouteDialogProps = {
  tripInformation: TripInformation;
  onUpdate: (updatedTripInformation: TripInformation) => void;
};

export default function EditRouteDialog({
  tripInformation,
  onUpdate
}: EditRouteDialogProps) {
  const [open, setOpen] = useState(false);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const fixedTripExpenses = useSelector<RootState, FixedTripExpense[]>(
    allFixedTripExpenses
  );
  const [isRefreshmentExpenseCustom, setIsRefreshmentExpenseCustom] = useState(false);
  const [isRewardCommissionCustom, setIsRewardCommissionCustom] = useState(false);
  const [tripData, setTripData] = useState<TripInformationInput>({
    ...tripInformation,
    sourceStation:
      routes.find(
        (route) => route.id === parseInt(tripInformation.routeId?.toString() as string)
      )?.sourceAdda ?? '',
    destinationStation:
      routes.find(
        (route) => route.id === parseInt(tripInformation.routeId?.toString() as string)
      )?.destinationAdda ?? ''
  });


  const calcTicketEarnings = (
    fullCount: number,
    halfCount: number,
    luxuryCount: number,
    standardTicketPrice: number,
    luxuryTicketPrice: number
  ) => {
    return (
      fullCount * standardTicketPrice +
      (halfCount * standardTicketPrice) / 2 +
      luxuryCount * luxuryTicketPrice
    );
  };

  const calculateRevenue = (updatedData: Omit<TripInformationInput, 'id'>) => {
    const standardTicketPrice = tickets.find(
      (ticket) =>
        ticket.routeId === updatedData.routeId &&
        ticket.busType === 'Standard'
    )?.ticketPrice;
    const luxuryTicketPrice = tickets.find(
      (ticket) =>
        ticket.routeId === updatedData.routeId &&
        ticket.busType === 'Business'
    )?.ticketPrice;

    let ticketEarnings = 0;
    if (standardTicketPrice !== undefined || luxuryTicketPrice !== undefined) {
      const fullCount = Number(updatedData.fullTicketCount) || 0;
      const halfCount = Number(updatedData.halfTicketCount) || 0;
      const luxuryCount = Number(updatedData.fullTicketBusinessCount) || 0;
      const revenue = calcTicketEarnings(
        fullCount,
        halfCount,
        luxuryCount,
        standardTicketPrice ?? 0,
        luxuryTicketPrice ?? 0
      );
      ticketEarnings = revenue;
    }

    const expenseForThisRouteId = fixedTripExpenses.find(
      (expense) => expense.routeId === Number(updatedData.routeId)
    );

    let remaining = ticketEarnings;
    remaining -= expenseForThisRouteId?.rewardCommission ?? 0;
    remaining -= expenseForThisRouteId?.steward ?? 0;
    remaining -= expenseForThisRouteId?.counter ?? 0;
    remaining -= expenseForThisRouteId?.dcParchi ?? 0;
    remaining -= Number(updatedData.refreshmentExpense) || 0;
    remaining += Number(updatedData.loadEarning) || 0;
    remaining -= Number(updatedData.rewardCommission) || 0;

    if (expenseForThisRouteId && expenseForThisRouteId.routeCommission > 1) {
      remaining -= expenseForThisRouteId.routeCommission;
    } else if (expenseForThisRouteId && expenseForThisRouteId.routeCommission < 1) {
      const standCommissionValue = expenseForThisRouteId.routeCommission * ticketEarnings;
      remaining -= standCommissionValue;
    }

    if (updatedData.miscellaneousAmount) {
      remaining += Number(updatedData.miscellaneousAmount);
    }
    return Number(remaining);
  };

  const handleRouteChange = (value: string) => {
    const route = routes.find(route => route.id === Number(value))
    setTripData((prev) => {
      const updatedData = { ...prev, sourceStation: route?.sourceAdda || "", destinationStation: route?.destinationAdda || "" }
      updatedData.routeId = Number(route?.id) || null;
      updatedData.revenue = calculateRevenue(updatedData);
      return updatedData;
    })
  }

  const calculateRefreshmentExpense = () => {
    if (tripData.routeId && tripData.passengerCount) {
      const expenseForThisRouteId = fixedTripExpenses.find(
        (expense) => expense.routeId === Number(tripData.routeId)
      );
      if (expenseForThisRouteId && expenseForThisRouteId.refreshment) {
        const calculatedRefreshmentExpense =
          Number(tripData.passengerCount) * expenseForThisRouteId.refreshment;
        return calculatedRefreshmentExpense;
      }
    }
    return '0';
  };

  const calculateRewardCommission = () => {
    if (tripData.routeId) {
      const expenseForThisRouteId = fixedTripExpenses.find(
        (expense) => expense.routeId === Number(tripData.routeId)
      );
      if (expenseForThisRouteId && expenseForThisRouteId.rewardCommission) {
        return expenseForThisRouteId.rewardCommission;
      }
    }
    return '0';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const numericFields = [
      'routeClosingVoucherId',
      'routeId',
      'passengerCount',
      'fullTicketBusinessCount',
      'fullTicketCount',
      'halfTicketCount',
      'freeTicketCount',
      'revenue',
      'refreshmentExpense',
      'rewardCommission'
    ];

    if (id === 'refreshmentExpense') {
      setIsRefreshmentExpenseCustom(true);
    }

    if (id === 'rewardCommission') {
      setIsRewardCommissionCustom(true);
    }

    setTripData((prev) => {
      const newData = {
        ...prev,
        [id]: numericFields.includes(id)
          ? value === '' || isNaN(Number(value)) ? '' : value
          : value
      };

      const fullCount = Number(newData.fullTicketCount) || 0;
      const halfCount = Number(newData.halfTicketCount) || 0;
      const freeCount = Number(newData.freeTicketCount) || 0;
      const luxuryCount = Number(newData.fullTicketBusinessCount) || 0;

      newData.passengerCount = Number(
        fullCount + halfCount + freeCount + luxuryCount
      );

      newData.revenue = calculateRevenue(newData);

      return newData;
    });
  };
 
  useEffect(() => {
    
    if (!tripData.refreshmentExpense) {
      const calculatedExpense = calculateRefreshmentExpense();
      setTripData((prev) => ({
        ...prev,
        refreshmentExpense: Number(calculatedExpense)
      }));
    }
    if (!tripData.rewardCommission) {
      const calculatedCommission = calculateRewardCommission();
      setTripData((prev) => ({
        ...prev,
        rewardCommission: Number(calculatedCommission)
      }));
    }
  }, [tripData.routeId, tripData.passengerCount, fixedTripExpenses]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedTripData: TripInformation = {
      id: Number(tripData.id),
      routeClosingVoucherId: Number(tripData.routeClosingVoucherId),
      routeId: Number(tripData.routeId),
      passengerCount: Number(tripData.passengerCount),
      fullTicketBusinessCount: Number(tripData.fullTicketBusinessCount),
      fullTicketCount: Number(tripData.fullTicketCount),
      halfTicketCount: Number(tripData.halfTicketCount),
      freeTicketCount: Number(tripData.freeTicketCount),
      miscellaneousAmount: Number(tripData.miscellaneousAmount),
      revenue: Number(tripData.revenue),
      revenueDiffExplanation: tripData.revenueDiffExplanation,
      refreshmentExpense: Number(tripData.refreshmentExpense),
      loadEarning: Number(tripData.loadEarning),
      rewardCommission: Number(tripData.rewardCommission),
      checkerExpense: Number(tripData.checkerExpense),
      date: tripData.date
    };

    onUpdate(updatedTripData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="my-2.5 mr-2 cursor-pointer">
          <Pen className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-[1024px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Edit Bus <span className="text-gradient">Closing Details</span>
            </DialogTitle>
            <DialogDescription>
              Update the details of the bus closing and click save when you are
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-8 py-4 md:grid-cols-2">
            <SelectField
              id="route"
              label="Select Route"
              value={tripData?.routeId?.toString()}
              onChange={handleRouteChange}
              placeholder="Select Route"
              options={routes.map((route) => ({
                value: route.id.toString(),
                label: `${route.sourceCity} (${route.sourceAdda}) - ${route.destinationCity} (${route.destinationAdda})`,
              }))}
              className="flex-col !items-start !space-x-0"
            />

            <div className="grid gap-2">
              <Label htmlFor="fullTicketBusinessCount" className="text-gradient">
                Full Ticket Luxury Count
              </Label>
              <Input
                id="fullTicketBusinessCount"
                type="number"
                placeholder="Enter full ticket count"
                value={tripData.fullTicketBusinessCount?.toString()}
                onChange={handleInputChange}
                min={0}
                max={9}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (Number(target.value) > 9) target.value = "9";
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullTicketCount" className="text-gradient">
                Full Ticket Count
              </Label>
              <Input
                id="fullTicketCount"
                type="number"
                value={tripData.fullTicketCount?.toString()}
                onChange={handleInputChange}
                placeholder="Enter Full Ticket Count"
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="halfTicketCount" className="text-gradient">
                Half Ticket Count
              </Label>
              <Input
                id="halfTicketCount"
                type="number"
                value={tripData.halfTicketCount?.toString()}
                onChange={handleInputChange}
                placeholder="Enter Half Ticket Count"
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="freeTicketCount" className="text-gradient">
                Free Ticket Count
              </Label>
              <Input
                id="freeTicketCount"
                type="number"
                value={tripData.freeTicketCount?.toString()}
                onChange={handleInputChange}
                placeholder="Enter Free Ticket Count"
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="passengerCount" className="text-gradient">
                Passenger Count
              </Label>
              <Input
                disabled={true}
                id="passengerCount"
                type="number"
                placeholder="Enter passenger count"
                value={tripData.passengerCount?.toString()}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="loadEarning" className="text-gradient">
                Load Earning
              </Label>
              <Input
                id="loadEarning"
                type="number"
                placeholder="Enter load expense"
                value={tripData.loadEarning?.toString()}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rewardCommission" className="text-gradient">
                Reward Commission
              </Label>
              <Input
                id="rewardCommission"
                type="number"
                placeholder={`Calculated: ${calculateRewardCommission()}`}
                value={tripData.rewardCommission?.toString()}
                onChange={handleInputChange}
                min={0}
                step="1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="refreshmentExpense" className="text-gradient">
                Refreshment Expense
              </Label>
              <Input
                id="refreshmentExpense"
                type="number"
                placeholder={`Calculated: ${calculateRefreshmentExpense()}`}
                value={tripData.refreshmentExpense?.toString()}
                onChange={handleInputChange}
                min={0}
                step="1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="checkerExpense" className="text-gradient">
                Checker Expenses
              </Label>
              <Input
                id="checkerExpense"
                type="number"
                placeholder="Enter checker expenses"
                value={tripData.checkerExpense?.toString()}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="miscellaneousAmount" className="text-gradient">
                Miscellaneous Expense
              </Label>
              <Input
                id="miscellaneousAmount"
                type="number"
                placeholder="Enter miscellaneous amount"
                value={tripData.miscellaneousAmount?.toString()}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="actualRevenue" className="text-gradient">
                Actual Revenue
              </Label>
              <Input
                id="actualRevenue"
                type="number"
                placeholder="Actual revenue"
                value={tripData.revenue?.toString()}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="revenueDiffExplanation" className="text-gradient">
                Miscellaneous Explanation
              </Label>
              <Textarea
                id="revenueDiffExplanation"
                value={tripData.revenueDiffExplanation}
                onChange={handleInputChange}
                placeholder="Enter explanation for revenue difference"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

