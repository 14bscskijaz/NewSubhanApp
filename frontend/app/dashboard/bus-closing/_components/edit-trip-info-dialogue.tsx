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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select'; // ShadCN Select
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
import { useState } from 'react';
import { useSelector } from 'react-redux';

type EditRouteDialogProps = {
  // route: BusClosing;
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
  const [tripData, setTripData] = useState<TripInformationInput>({
    ...tripInformation,
    sourceStation:
      routes.find(
        (route) => route.id === parseInt(tripInformation.routeId as string)
      )?.sourceAdda ?? '',
    destinationStation:
      routes.find(
        (route) => route.id === parseInt(tripInformation.routeId as string)
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
    // Get the ticket price for standard and luxury buses tickets
    const standardTicketPrice = tickets.find(
      (ticket: { routeId: { toString: () => string | undefined; }; busType: string; }) =>
        ticket.routeId.toString() === updatedData.routeId &&
        ticket.busType === 'Standard'
    )?.ticketPrice;
    const luxuryTicketPrice = tickets.find(
      (ticket: { routeId: { toString: () => string | undefined; }; busType: string; }) =>
        ticket.routeId.toString() === updatedData.routeId &&
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

    // Subtract the fixed trip expenses from the ticket earnings. Possibly can be undefined
    const expenseForThisRouteId = fixedTripExpenses.find(
      (expense: { routeId: number; }) => expense.routeId === Number(updatedData.routeId)
    );

    let remaining = ticketEarnings;
    remaining -= expenseForThisRouteId?.rewardCommission ?? 0;
    remaining -= expenseForThisRouteId?.steward ?? 0;
    remaining -= expenseForThisRouteId?.counter ?? 0;
    remaining -= expenseForThisRouteId?.dcParchi ?? 0;
    remaining -= expenseForThisRouteId?.refreshment ?? 0;

    // Calculate Stand Commission (routeCommission variable in code)
    if (expenseForThisRouteId && expenseForThisRouteId.routeCommission > 1) {
      remaining -= expenseForThisRouteId.routeCommission;
    } else if (expenseForThisRouteId && expenseForThisRouteId.routeCommission < 1) {
      const standCommissionValue = expenseForThisRouteId.routeCommission * ticketEarnings;
      remaining -= standCommissionValue;
    } 

    // Add or subtract the miscellaneous amount
    if (updatedData.miscellaneousAmount) {
      remaining += Number(updatedData.miscellaneousAmount);
    }
    return String(remaining);
  };

  const handleSelectChange = (
    id: keyof TripInformationInput,
    value: string
  ) => {
    setTripData((prev) => {
      const updatedData = { ...prev, [id]: value };

      if (id === 'sourceStation' || id === 'destinationStation') {
        // Recalculate the routeId if source or destination station changes
        const newRouteId = routes.find(
          (route) =>
            route.sourceAdda ===
              (id === 'sourceStation' ? value : prev.sourceStation) &&
            route.destinationAdda ===
              (id === 'destinationStation' ? value : prev.destinationStation)
        )?.id;
        updatedData.routeId = newRouteId ? String(newRouteId) : '';

        // Recalculate revenue with the new ticket price
        console.log('updated Data route id: ', updatedData.routeId);
        updatedData.revenue = calculateRevenue(updatedData);
      }

      return updatedData;
    });
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
      'revenue'
    ];

    setTripData((prev) => {
      const newData = {
        ...prev,
        // If id is in numericFields, set value to empty string if it's not a number
        [id]: numericFields.includes(id)
          ? value === '' || (isNaN(Number(value)) ? '' : value)
          : value
      };

      // If the changed field is a numeric field, set actual revenue to empty string, else remain same.
      newData.revenue = numericFields.includes(id)
        ? ''
        : newData.revenue;

      const fullCount = Number(newData.fullTicketCount) || 0;
      const halfCount = Number(newData.halfTicketCount) || 0;
      const freeCount = Number(newData.freeTicketCount) || 0;
      const luxuryCount = Number(newData.fullTicketBusinessCount) || 0;

      // Calculate the passenger count
      newData.passengerCount = String(
        fullCount + halfCount + freeCount + luxuryCount
      );
      console.log('new Data full ticket routeID:', newData.routeId);
      // Calculate the revenue if we have a ticket price
      newData.revenue = calculateRevenue(newData);

      return newData;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedTripData: TripInformation = {
      id: tripData.id,
      routeClosingVoucherId: tripData.routeClosingVoucherId,
      routeId: tripData.routeId,
      passengerCount: tripData.passengerCount,
      fullTicketBusinessCount: tripData.fullTicketBusinessCount,
      fullTicketCount: tripData.fullTicketCount,
      halfTicketCount: tripData.halfTicketCount,
      freeTicketCount: tripData.freeTicketCount,
      miscellaneousAmount: tripData.miscellaneousAmount,
      revenue: tripData.revenue,
      revenueDiffExplanation: tripData.revenueDiffExplanation,
      loadExpense: tripData.loadExpense,
      rewardCommission: tripData.rewardCommission,
      refreshmentExpense: tripData.refreshmentExpense
    };

    onUpdate(updatedTripData);
    setOpen(false);
  };

  const getSourceStations = () => {
    const uniqueSourceStations = new Map();
    routes.forEach((route: { sourceAdda: any; sourceCity: any; }) => {
      if (!uniqueSourceStations.has(route.sourceAdda)) {
        uniqueSourceStations.set(route.sourceAdda, {
          value: route.sourceAdda,
          label: `${route.sourceAdda} (${route.sourceCity})`
        });
      }
    });
    return Array.from(uniqueSourceStations.values());
  };

  const getDestinationStations = () => {
    const uniqueDestinationStations = new Map();
    routes.forEach((route: { destinationAdda: any; destinationCity: any; }) => {
      if (!uniqueDestinationStations.has(route.destinationAdda)) {
        uniqueDestinationStations.set(route.destinationAdda, {
          value: route.destinationAdda,
          label: `${route.destinationAdda} (${route.destinationCity})`
        });
      }
    });
    return Array.from(uniqueDestinationStations.values());
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
            <DialogTitle>
              Edit Bus <span className="text-gradient">Closing Details</span>
            </DialogTitle>
            <DialogDescription>
              Update the details of the bus closing and click save when you are
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-8 py-4 md:grid-cols-2">
            {/* Source Station Dropdown */}
            <SelectField
              id="sourceStation"
              value={tripData.sourceStation}
              onChange={(value) => handleSelectChange("sourceStation", value)}
              placeholder="Select Source Station"
              options={getSourceStations()}
              label="Source Station"
              className="flex-col !space-x-0 gap-y-2 !items-start"
            />

            <SelectField
              id="destinationStation"
              value={tripData.destinationStation}
              onChange={(value) => handleSelectChange("destinationStation", value)}
              placeholder="Select Destination Station"
              options={getDestinationStations()}
              label="Destination Station"
              className="flex-col !space-x-0 gap-y-2 !items-start"
            />

            {/* Other Fields */}
            {/* <div className="grid gap-2">
              <Label htmlFor="routeClosingVoucherId">
                Voucher <span className="text-gradient">ID</span>
              </Label>
              <Input
                id="routeClosingVoucherId"
                type="number"
                value={tripData.routeClosingVoucherId}
                onChange={handleInputChange}
                placeholder="Enter Voucher ID"
              />
            </div> */}
            <div className="grid gap-2">
              <Label htmlFor="passengerCount">
                Passenger <span className="text-gradient">Count</span>
              </Label>
              <Input
                id="passengerCount"
                type="number"
                value={tripData.passengerCount}
                onChange={handleInputChange}
                placeholder="Enter Passenger Count"
                disabled
                readOnly
              />
            </div>

            {/* Full Ticket Luxury Count */}
            <div className="grid gap-2">
              <Label htmlFor="fullTicketBusinessCount">
                Full Ticket Luxury Count
              </Label>
              <Input
                id="fullTicketBusinessCount"
                type="number"
                placeholder="Enter full ticket count"
                value={tripData.fullTicketBusinessCount}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullTicketCount">
                Full Ticket <span className="text-gradient">Count</span>{' '}
              </Label>
              <Input
                id="fullTicketCount"
                type="number"
                value={tripData.fullTicketCount}
                onChange={handleInputChange}
                placeholder="Enter Full Ticket Count"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="halfTicketCount">
                Half Ticket <span className="text-gradient">Count</span>
              </Label>
              <Input
                id="halfTicketCount"
                type="number"
                value={tripData.halfTicketCount}
                onChange={handleInputChange}
                placeholder="Enter Half Ticket Count"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="freeTicketCount">
                Free Ticket <span className="text-gradient">Count</span>
              </Label>
              <Input
                id="freeTicketCount"
                type="number"
                value={tripData.freeTicketCount}
                onChange={handleInputChange}
                placeholder="Enter Free Ticket Count"
              />
            </div>

            {/* Miscellaneous Revenue */}
            <div className="grid gap-2">
              <Label htmlFor="miscellaneousAmount">Miscellaneous Amount</Label>
              <Input
                id="miscellaneousAmount"
                type="number"
                placeholder="Calculated revenue"
                value={tripData.miscellaneousAmount}
                onChange={handleInputChange}
              />
            </div>

            {/* Actual Revenue */}
            <div className="grid gap-2">
              <Label htmlFor="actualRevenue">Actual Revenue</Label>
              <Input
                id="actualRevenue"
                type="number"
                placeholder="Actual revenue"
                value={tripData.revenue}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="revenueDiffExplanation">
              Miscellaneous  Difference{' '}
                <span className="text-gradient">Explanation</span>
              </Label>
              <Textarea
                id="revenueDiffExplanation"
                value={tripData.revenueDiffExplanation}
                onChange={handleInputChange}
                placeholder="Explain Revenue Differences"
                className="rounded-md border p-2"
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
