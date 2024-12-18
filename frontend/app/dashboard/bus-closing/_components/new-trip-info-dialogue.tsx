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
import { useToast } from '@/hooks/use-toast';
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
import { useState, useEffect } from 'react';
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
  routeId: string;
}) {
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const fixedTripExpenses = useSelector<RootState, FixedTripExpense[]>(
    allFixedTripExpenses
  );
  const [open, setOpen] = useState(false);
  const [tripData, setTripData] = useState<Omit<TripInformationInput, 'id'>>({
    routeClosingVoucherId: null,
    routeId: null,
    passengerCount: null,
    fullTicketBusinessCount: null,
    fullTicketCount: null,
    halfTicketCount: null,
    freeTicketCount: null,
    miscellaneousAmount: null,
    revenue: null,
    revenueDiffExplanation: "",
    sourceStation: "",
    destinationStation: "",
    loadEarning: null,
    rewardCommission: null,
    refreshmentExpense: null,
    date: date
  });
  const [isRefreshmentExpenseCustom, setIsRefreshmentExpenseCustom] = useState(false);
  const [isRewardCommissionCustom, setIsRewardCommissionCustom] = useState(false);

  const { toast } = useToast();

  const dispatch = useDispatch();

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

  const handleSelectChange = (
    id: keyof TripInformationInput,
    value: string
  ) => {
    const stationName = value.split(' (')[0];
    setTripData((prev) => {
      const updatedData = { ...prev, [id]: stationName };

      if (id === 'sourceStation' || id === 'destinationStation') {
        const newRouteId = routes.find(
          (route) =>
            route.sourceAdda ===
            (id === 'sourceStation' ? stationName : prev.sourceStation) &&
            route.destinationAdda ===
            (id === 'destinationStation' ? stationName : prev.destinationStation)
        )?.id;
        updatedData.routeId = newRouteId ? Number(newRouteId) : null;
        updatedData.revenue = calculateRevenue(updatedData);
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
      'revenue',
      'refreshmentExpense',
      'rewardCommission'
    ];

    setTripData((prev) => {
      let newValue = value;
      if (numericFields.includes(id)) {
        const numericValue = Number(value);
        if (id === "fullTicketBusinessCount" && numericValue > 9) {
          newValue = "9";
        }
      }

      if (id === 'refreshmentExpense') {
        setIsRefreshmentExpenseCustom(true);
      }

      if (id === 'rewardCommission') {
        setIsRewardCommissionCustom(true);
      }

      if (id === 'routeId' || id === 'passengerCount') {
        setIsRefreshmentExpenseCustom(false);
        setIsRewardCommissionCustom(false);
      }

      const newData = {
        ...prev,
        [id]: newValue
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
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
        revenue: tripData.revenue,
        revenueDiffExplanation: tripData.revenueDiffExplanation,
        refreshmentExpense: tripData.refreshmentExpense,
        loadEarning: tripData.loadEarning,
        rewardCommission: tripData.rewardCommission,
        date: date
      };

      dispatch(addTripInformation(newTripData));

      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(error.message);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000
      })
    }
  };

  const resetForm = () => {
    setTripData({
      routeClosingVoucherId: null,
      routeId: null,
      passengerCount: null,
      fullTicketBusinessCount: null,
      fullTicketCount: null,
      halfTicketCount: null,
      freeTicketCount: null,
      miscellaneousAmount: null,
      revenue: null,
      revenueDiffExplanation: '',
      sourceStation: '',
      destinationStation: '',
      loadEarning: null,
      rewardCommission: null,
      refreshmentExpense: null,
      date: date
    });
    setIsRefreshmentExpenseCustom(false);
    setIsRewardCommissionCustom(false);
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

  useEffect(() => {
    if (!isRefreshmentExpenseCustom) {
      const calculatedExpense = calculateRefreshmentExpense();
      setTripData((prev) => ({
        ...prev,
        refreshmentExpense: Number(calculatedExpense)
      }));
    }
    if (!isRewardCommissionCustom) {
      const calculatedCommission = calculateRewardCommission();
      setTripData((prev) => ({
        ...prev,
        rewardCommission: Number(calculatedCommission)
      }));
    }
  }, [tripData.routeId, tripData.passengerCount, fixedTripExpenses, isRefreshmentExpenseCustom, isRewardCommissionCustom]);

  const isFormComplete =
    busId && voucherNumber && driverId && routeId && date;

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
            {/* Route Dropdown */}
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
              <Label htmlFor="fullTicketBusinessCount" className='text-gradient'>
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
              <Label htmlFor="fullTicketCount" className='text-gradient'>Full Ticket Count</Label>
              <Input
                id="fullTicketCount"
                type="number"
                placeholder="Enter full ticket count"
                value={tripData.fullTicketCount?.toString()}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="halfTicketCount" className='text-gradient'>Half Ticket Count</Label>
              <Input
                id="halfTicketCount"
                type="number"
                placeholder="Enter half ticket count"
                value={tripData.halfTicketCount?.toString()}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="freeTicketCount" className='text-gradient'>Free Ticket Count</Label>
              <Input
                id="freeTicketCount"
                type="number"
                placeholder="Enter free ticket count"
                value={tripData.freeTicketCount?.toString()}
                onChange={handleInputChange}
                min={0}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="passengerCount" className='text-gradient'>Passenger Count</Label>
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
              <Label htmlFor="loadEarning" className="text-gradient">Load Expense</Label>
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
              <Label htmlFor="rewardCommission" className="text-gradient">Reward Commission</Label>
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
              <Label htmlFor="refreshmentExpense" className="text-gradient">Refreshment Expense</Label>
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
              <Label htmlFor="miscellaneousAmount" className='text-gradient'>Miscellaneous Amount</Label>
              <Input
                id="miscellaneousAmount"
                type="number"
                placeholder="Enter miscellaneous amount"
                value={tripData.miscellaneousAmount?.toString()}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="actualRevenue" className='text-gradient'>Actual Revenue</Label>
              <Input
                id="actualRevenue"
                type="number"
                placeholder="Actual revenue"
                value={tripData.revenue?.toString()}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="revenueDiffExplanation" className='text-gradient'>
                Miscellaneous Explanation
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

