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
} from '@/components/ui/select';
import { BusClosing } from '@/lib/slices/bus-closing';
import {
  FixedTripExpense,
  allFixedTripExpenses
} from '@/lib/slices/fixed-trip-expense';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices'; // Make sure this path is correct
import { Route, allRoutes } from '@/lib/slices/route-slices';
import {
  TripInformation,
  TripInformationInput,
  addTripInformation
} from '@/lib/slices/trip-information';
import { RootState } from '@/lib/store';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function NewRouteDialog({
  busId,
  voucherNumber,
  driverId,
  date
}: {
  busId: string;
  voucherNumber: string;
  driverId: string;
  date?: string
}) {
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const fixedTripExpenses = useSelector<RootState, FixedTripExpense[]>(
    allFixedTripExpenses
  );
  const [open, setOpen] = useState(false);
  const [tripData, setTripData] = useState<Omit<TripInformationInput, 'id'>>({
    routeClosingVoucherId: '',
    routeId: '',
    passengerCount: '',
    fullTicketBusinessCount: '',
    fullTicketCount: '',
    halfTicketCount: '',
    freeTicketCount: '',
    miscellaneousAmount: '',
    actualRevenue: '',
    revenueDiffExplanation: '',
    sourceStation: '',
    destinationStation: '',
    date: date
  });

  const dispatch = useDispatch();
  // const ticketPrice = useSelector<RootState, number | undefined>((state) =>
  //   tickets.find(ticket => ticket.routeId === Number(routeId))?.ticketPrice
  // );

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
    // Get the ticket price for standard and luxury buses tickets
    const standardTicketPrice = tickets.find(
      (ticket) =>
        ticket.routeId.toString() === updatedData.routeId &&
        ticket.busType === 'Standard'
    )?.ticketPrice;
    const luxuryTicketPrice = tickets.find(
      (ticket) =>
        ticket.routeId.toString() === updatedData.routeId &&
        ticket.busType === 'Business'
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
            route.sourceAdda ===
            (id === 'sourceStation' ? value : prev.sourceStation) &&
            route.destinationAdda ===
            (id === 'destinationStation' ? value : prev.destinationStation)
        )?.id;
        updatedData.routeId = newRouteId ? String(newRouteId) : '';

        // Recalculate revenue with the new ticket price
        updatedData.actualRevenue = calculateRevenue(updatedData);
      }

      return updatedData;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const fullCount = Number(newData.fullTicketCount) || 0;
      const halfCount = Number(newData.halfTicketCount) || 0;
      const freeCount = Number(newData.freeTicketCount) || 0;
      const luxuryCount = Number(newData.fullTicketBusinessCount) || 0;

      // Calculate the passenger count
      newData.passengerCount = String(
        fullCount + halfCount + freeCount + luxuryCount
      );
      // Calculate the revenue if we have a ticket price
      newData.actualRevenue = calculateRevenue(newData);

      return newData;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTripData: Omit<TripInformation, 'id'> = {
      routeClosingVoucherId: tripData.routeClosingVoucherId,
      routeId: tripData.routeId,
      passengerCount: tripData.passengerCount,
      fullTicketBusinessCount: tripData.fullTicketBusinessCount,
      fullTicketCount: tripData.fullTicketCount,
      halfTicketCount: tripData.halfTicketCount,
      freeTicketCount: tripData.freeTicketCount,
      miscellaneousAmount: tripData.miscellaneousAmount,
      actualRevenue: tripData.actualRevenue,
      revenueDiffExplanation: tripData.revenueDiffExplanation,
      date: date
    };

    
    // await createTrip(newTripData)
    // dispatch(addBusClosing(newRoute));
    dispatch(addTripInformation(newTripData));
    setOpen(false);
    resetForm();
  };


  const resetForm = () => {
    setTripData({
      routeClosingVoucherId: '',
      routeId: '',
      passengerCount: '',
      fullTicketBusinessCount: '',
      fullTicketCount: '',
      halfTicketCount: '',
      freeTicketCount: '',
      miscellaneousAmount: '',
      actualRevenue: '',
      revenueDiffExplanation: '',
      sourceStation: '',
      destinationStation: ''
    });
  };

  const getSourceStations = () => {
    return [...new Set(routes.map((route) => route.sourceAdda))];
  };

  const getDestinationStations = () => {
    return [...new Set(routes.map((route) => route.destinationAdda))];
  };

  // Check if all required values are set (routeId, busId, voucherNumber, driverId)
  const isFormComplete =
    busId && voucherNumber && driverId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!isFormComplete}>
          <Plus className="mr-2 h-4 w-4" /> Add Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-[500px] overflow-y-auto sm:max-w-[900px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add New <span className="text-gradient">Trip</span>
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new bus closing expense here. Click save
              when you are done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-12 py-4 md:grid-cols-2">
            {/* Source Station Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="sourceStation">Source Station</Label>
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
              <Label htmlFor="destinationStation">Destination Station</Label>
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
                min={0}
              />
            </div>

            {/* Full Ticket Count */}
            <div className="grid gap-2">
              <Label htmlFor="fullTicketCount">Full Ticket Count</Label>
              <Input
                id="fullTicketCount"
                type="number"
                placeholder="Enter full ticket count"
                value={tripData.fullTicketCount}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            {/* Half Ticket Count */}
            <div className="grid gap-2">
              <Label htmlFor="halfTicketCount">Half Ticket Count</Label>
              <Input
                id="halfTicketCount"
                type="number"
                placeholder="Enter half ticket count"
                value={tripData.halfTicketCount}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            {/* Free Ticket Count */}
            <div className="grid gap-2">
              <Label htmlFor="freeTicketCount">Free Ticket Count</Label>
              <Input
                id="freeTicketCount"
                type="number"
                placeholder="Enter free ticket count"
                value={tripData.freeTicketCount}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            {/* Passenger Count */}
            <div className="grid gap-2">
              <Label htmlFor="passengerCount">Passenger Count</Label>
              <Input
                disabled={true}
                id="passengerCount"
                type="number"
                placeholder="Enter passenger count"
                value={tripData.passengerCount}
                onChange={handleInputChange}
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

            {/* Explanation for Revenue Difference */}
            <div className="grid gap-2">
              <Label htmlFor="revenueDiffExplanation">
                Revenue Explanation
              </Label>
              <Input
                id="revenueDiffExplanation"
                type="text"
                placeholder="Enter explanation for revenue difference"
                value={tripData.revenueDiffExplanation}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
