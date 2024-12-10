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
  FixedTripExpense,
  allFixedTripExpenses
} from '@/lib/slices/fixed-trip-expense';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
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
  date,
  routeId
}: {
  busId: string;
  voucherNumber: string;
  driverId: string;
  date?: string;
  routeId:string;
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
    const stationName = value.split(' (')[0]; // Extract station name only
    setTripData((prev) => {
      const updatedData = { ...prev, [id]: stationName };

      if (id === 'sourceStation' || id === 'destinationStation') {
        const newRouteId = routes.find(
          (route: { sourceAdda: string; destinationAdda: string; }) =>
            route.sourceAdda ===
            (id === 'sourceStation' ? stationName : prev.sourceStation) &&
            route.destinationAdda ===
            (id === 'destinationStation' ? stationName : prev.destinationStation)
        )?.id;
        updatedData.routeId = newRouteId ? String(newRouteId) : '';
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
      let newValue = value;
      if (numericFields.includes(id)) {
        const numericValue = Number(value);
        if (id === "fullTicketBusinessCount" && numericValue > 9) {
          newValue = "9"; // Restrict the maximum value for this specific field
        }
      }
  
      const newData = {
        ...prev,
        [id]: newValue
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




  // Check if all required values are set (routeId, busId, voucherNumber, driverId)
  const isFormComplete =
    busId && voucherNumber && driverId && routeId;

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

            {/* Full Ticket Luxury Count */}
            <div className="grid gap-2">
              <Label htmlFor="fullTicketBusinessCount" className='text-gradient'>
                Full Ticket Luxury Count
              </Label>
              <Input
                id="fullTicketBusinessCount"
                type="number"
                placeholder="Enter full ticket count"
                value={tripData.fullTicketBusinessCount}
                onChange={handleInputChange}
                min={0}
                max={9}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (Number(target.value) > 9) target.value = "9";
                }}
              />
            </div>

            {/* Full Ticket Count */}
            <div className="grid gap-2">
              <Label htmlFor="fullTicketCount" className='text-gradient'>Full Ticket Count</Label>
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
              <Label htmlFor="halfTicketCount" className='text-gradient'>Half Ticket Count</Label>
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
              <Label htmlFor="freeTicketCount" className='text-gradient'>Free Ticket Count</Label>
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
              <Label htmlFor="passengerCount" className='text-gradient'>Passenger Count</Label>
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
              <Label htmlFor="miscellaneousAmount" className='text-gradient'>Miscellaneous Amount</Label>
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
              <Label htmlFor="actualRevenue" className='text-gradient'>Actual Revenue</Label>
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
              <Label htmlFor="revenueDiffExplanation" className='text-gradient'>
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
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
