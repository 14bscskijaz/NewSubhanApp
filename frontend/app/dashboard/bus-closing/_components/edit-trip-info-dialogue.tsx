'use client';

import { useState, useEffect } from 'react';
import { Pen } from 'lucide-react';
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
  SelectItem,
  SelectTrigger,
  SelectContent
} from '@/components/ui/select'; // ShadCN Select
import { BusClosing } from '@/lib/slices/bus-closing';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { Textarea } from '@/components/ui/textarea';
import {
  TripInformation,
  TripInformationInput
} from '@/lib/slices/trip-information';
import { allTicketsRaw, TicketPriceRaw } from '@/lib/slices/pricing-slices';
import {
  allFixedTripExpenses,
  FixedTripExpense
} from '@/lib/slices/fixed-trip-expense';

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
      )?.sourceStation ?? '',
    destinationStation:
      routes.find(
        (route) => route.id === parseInt(tripInformation.routeId as string)
      )?.destinationStation ?? ''
  });

  const performRevenueCalculationMaths = (
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
    console.log('Route ID in calculate revenuw: ', updatedData.routeId);
    // Get the ticket price for standard and luxury buses tickets
    const standardTicketPrice = tickets.find(
      (ticket) =>
        ticket.routeId.toString() === updatedData.routeId &&
        ticket.busType === 'Standard'
    )?.ticketPrice;
    const luxuryTicketPrice = tickets.find(
      (ticket) =>
        ticket.routeId.toString() === updatedData.routeId &&
        ticket.busType === 'Luxury'
    )?.ticketPrice;

    let ticketEarnings = 0;
    if (standardTicketPrice !== undefined && luxuryTicketPrice !== undefined) {
      const fullCount = Number(updatedData.fullTicketCount) || 0;
      const halfCount = Number(updatedData.halfTicketCount) || 0;
      const luxuryCount = Number(updatedData.fullTicketBusinessCount) || 0;
      const revenue = performRevenueCalculationMaths(
        fullCount,
        halfCount,
        luxuryCount,
        standardTicketPrice,
        luxuryTicketPrice
      );
      ticketEarnings = revenue;
    }

    // Subtract the fixed trip expenses from the ticket earnings(
    const expenseForThisRouteId = fixedTripExpenses.find(
      (expense) => expense.routeId === Number(updatedData.routeId)
    );

    let remaining = ticketEarnings;
    remaining -= expenseForThisRouteId?.routeCommission ?? 0;
    remaining -= expenseForThisRouteId?.rewardCommission ?? 0;
    remaining -= expenseForThisRouteId?.steward ?? 0;
    remaining -= expenseForThisRouteId?.counter ?? 0;
    remaining -= expenseForThisRouteId?.dcParchi ?? 0;
    remaining -= expenseForThisRouteId?.refreshment ?? 0;

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
            route.sourceStation ===
              (id === 'sourceStation' ? value : prev.sourceStation) &&
            route.destinationStation ===
              (id === 'destinationStation' ? value : prev.destinationStation)
        )?.id;
        updatedData.routeId = newRouteId ? String(newRouteId) : '';

        // Recalculate revenue with the new ticket price
        console.log('updated Data route id: ', updatedData.routeId);
        updatedData.actualRevenue = calculateRevenue(updatedData);
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
      newData.actualRevenue = numericFields.includes(id)
        ? ''
        : newData.actualRevenue;

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
      newData.actualRevenue = calculateRevenue(newData);

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
      actualRevenue: tripData.actualRevenue,
      revenueDiffExplanation: tripData.revenueDiffExplanation
    };

    onUpdate(updatedTripData);
    setOpen(false);
  };

  const getSourceStations = () => {
    return [...new Set(routes.map((route) => route.sourceStation))];
  };

  const getDestinationStations = () => {
    return [...new Set(routes.map((route) => route.destinationStation))];
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
            <div className="grid gap-2">
              <Label htmlFor="sourceStation">
                Source <span className="text-gradient">Station</span>
              </Label>
              <Select
                value={tripData.sourceStation}
                onValueChange={(value) =>
                  handleSelectChange('sourceStation', value)
                }
              >
                <SelectTrigger>
                  <span>
                    {tripData.sourceStation || 'Select Source Station'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {getSourceStations().map((station, index) => (
                    <SelectItem key={index} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination Station Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="destinationStation">
                Destination <span className="text-gradient">Station</span>
              </Label>
              <Select
                value={tripData.destinationStation}
                onValueChange={(value) =>
                  handleSelectChange('destinationStation', value)
                }
              >
                <SelectTrigger>
                  <span>
                    {tripData.destinationStation ||
                      'Select Destination Station'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {getDestinationStations().map((station, index) => (
                    <SelectItem key={index} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Other Fields */}
            <div className="grid gap-2">
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
            </div>
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
                value={tripData.actualRevenue}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="revenueDiffExplanation">
                Revenue Difference{' '}
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
