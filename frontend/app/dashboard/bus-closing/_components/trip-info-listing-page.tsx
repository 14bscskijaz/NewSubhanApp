'use client'

import { getAllBuses } from '@/app/actions/bus.action'
import { getAllEmployees } from '@/app/actions/employee.action'
import { getAllRoutes } from '@/app/actions/route.action'
import PageContainer from '@/components/layout/page-container'
import InputField from '@/components/ui/InputField'
import SelectField from '@/components/ui/SelectField'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Heading } from '@/components/ui/heading'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Buses, allBuses, setBus } from '@/lib/slices/bus-slices'
import { Employee, allEmployees, setEmployee } from '@/lib/slices/employe-slices'
import { TicketPriceRaw, allTicketsRaw, setTicketRaw } from '@/lib/slices/pricing-slices'
import { Route, allRoutes, setRoute } from '@/lib/slices/route-slices'
import { TripInformation, allTripsInformation } from '@/lib/slices/trip-information'
import { RootState } from '@/lib/store'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NewRouteDialog from './new-trip-info-dialogue'
import RouteTable from './trip-info-tables'
import VoucherForm from './voucher-form'
import { getAllFixedTripExpenses } from '@/app/actions/FixedTripExpense.action'
import { setFixedTripExpense } from '@/lib/slices/fixed-trip-expense'
import busClosing, { BusClosing, addBusClosing, allBusClosings } from '@/lib/slices/bus-closing'
import { getAllTicketPrices } from '@/app/actions/pricing.action'
import { useToast } from '@/hooks/use-toast'

export default function TripInfoListingPage() {
  const tripsInformation = useSelector<RootState, TripInformation[]>(allTripsInformation)
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const employees = useSelector<RootState, Employee[]>(allEmployees);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const busClosing = useSelector<RootState, BusClosing[]>(allBusClosings)

  const [voucherNumber, setVoucherNumber] = useState<string>(busClosing ? busClosing[0]?.voucherNumber : '');
  const [conductorId, setConductorId] = useState<string | undefined>(busClosing ? busClosing[0]?.conductorId : '');
  const [driverId, setDriverId] = useState<string>(busClosing ? busClosing[0]?.driverId : '')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pageLimit, setPageLimit] = useState(20)
  const [busId, setBusId] = useState<string>(busClosing ? busClosing[0]?.busId : '')
  const [isVoucherShow, setIsVoucherShow] = useState(false)
  const [tripRevenue, setTripRevenue] = useState<string>('')
  const [totalExpense, setTotalExpense] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    busClosing && busClosing[0]?.date ? new Date(busClosing[0].date) : new Date()
  );
  const [selectedRoute, setSelectedRoute] = useState<string>(busClosing ? busClosing[0]?.routeId : '');
  const { toast } = useToast();

  const searchParams = useSearchParams()

  const dispatch = useDispatch();

  const fetchAllData = async () => {
    try {
      const allBuses = await getAllBuses();
      const allEmployees = await getAllEmployees();
      const allRoutes = await getAllRoutes();
      const tickets = await getAllTicketPrices();
      const fixedTripExpenses = await getAllFixedTripExpenses();
      dispatch(setRoute(allRoutes));
      dispatch(setTicketRaw(tickets));
      dispatch(setEmployee(allEmployees));
      dispatch(setBus(allBuses));
      dispatch(setFixedTripExpense(fixedTripExpenses));

    } catch (error: any) {
      console.error(error.message);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000
      })
    }
  }
  useEffect(() => {
    fetchAllData();
  }, [])

  useEffect(() => {
    const pageParam = searchParams.get('page') || '1'
    const searchParam = searchParams.get('q') || ''
    const limitParam = searchParams.get('limit') || '20'

    setPage(Number(pageParam))
    setSearch(searchParam)
    setPageLimit(Number(limitParam))
  }, [searchParams])

  useEffect(() => {
    const totalRevenue = tripsInformation.reduce((total, route) => {
      return total + (Number(route.actualRevenue) || 0)
    }, 0)

    setTripRevenue(String(totalRevenue))
  }, [tripsInformation])

  useEffect(() => {
    if (voucherNumber && driverId && busId && selectedDate && selectedRoute) {

      const updatedBusClosing: BusClosing = {
        voucherNumber,
        conductorId,
        driverId,
        busId,
        date: selectedDate.toISOString(),
        routeId: selectedRoute,
      };

      // Dispatch the updated data to Redux
      dispatch(addBusClosing(updatedBusClosing));
    }
  }, [voucherNumber, conductorId, driverId, busId, selectedDate, selectedRoute, dispatch]);


  // Filter routes that exist in ticketsRaw
  const filterTicketRoutes = routes.filter((route) =>
    ticketsRaw.some((ticket) => ticket.routeId === route.id)
  );

  const conductors = employees.filter(
    (employee) => employee.employeeType.toLowerCase() === 'conductor'
  );

  // const Routes = routes.filter((route) =>
  //   ticketsRaw.some((ticket) => ticket.routeId === route.id)
  // )

  const filteredRoutes = tripsInformation.filter((route) => {
    const matchesSearch = search
      ? Object.values(route).some((value) => value?.toString().includes(search))
      : true

    return matchesSearch
  })

  const totalUsers = filteredRoutes.length
  const startIndex = (page - 1) * pageLimit
  const paginatedRoutes = filteredRoutes.slice(
    startIndex,
    startIndex + pageLimit
  )

  const formatAmount = (amount: string | number) => {
    return Number(amount).toLocaleString('en-US');
};

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center text-nowrap space-x-5">
            <Label htmlFor="date" className="text-gradient text-sm font-medium">Date</Label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className=""
            />
          </div>

          <SelectField
            id="busNumber"
            label="Bus Number"
            value={busId}
            onChange={setBusId}
            placeholder="Select Bus Number"
            options={buses.map((bus) => ({
              value: bus.id.toString(),
              label: bus.busNumber
            }))}
          />

          <InputField
            id="voucherNumber"
            label="Voucher Number"
            value={voucherNumber}
            onChange={(e) => setVoucherNumber(e.target.value)}
            placeholder="Enter Voucher Number"
          />
          <SelectField
            id="route"
            label="Route"
            value={selectedRoute}
            onChange={setSelectedRoute}
            placeholder="Select Route"
            options={filterTicketRoutes.map((route) => ({
              value: route.id.toString(),
              label: `${route.sourceCity} (${route.sourceAdda}) - ${route.destinationCity} (${route.destinationAdda})`,
            }))}
            className=""
          />
          <SelectField
            id="driver"
            label="Select Driver"
            value={driverId}
            onChange={setDriverId}
            placeholder="Select Driver"
            options={employees
              .filter((employee) => employee.employeeType === 'Driver')
              .map((employee) => ({
                value: employee.id.toString(),
                label: `${employee.firstName} ${employee.lastName}`
              }))}
          />
          <SelectField
            id="conductor"
            label="Select Conductor"
            value={conductorId}
            onChange={setConductorId}
            placeholder="Select Conductor"
            options={conductors.map((conductor) => ({
              value: conductor.id.toString(),
              label: `${conductor.firstName} ${conductor.lastName}`,
            }))}
          />

        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 relative"
          style={{ gridTemplateColumns: '45% 55%' }}>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex items-start gap-x-4">
                <Heading title={`Trips (${totalUsers})`} description="" />
                <NewRouteDialog
                  busId={busId}
                  voucherNumber={voucherNumber}
                  driverId={driverId}
                  date={selectedDate?.toISOString()}
                  routeId={selectedRoute}
                // conductorId={conductorId}
                />
              </div>
              <Separator />
            </div>
            <RouteTable data={paginatedRoutes} totalData={totalUsers} />
            {parseInt(tripRevenue) > 0 && (
              <div className="mt-4 flex md:justify-end justify-start text-lg">
                <span className="text-gradient font-bold">Total Revenue</span>: {formatAmount(tripRevenue)}
              </div>
            )}
          </div>
          <div className='w-[1px] h-full left-[45.6%] bg-neutral-200 absolute hidden md:block'></div>
          <Separator className='md:hidden' />
          <div className="relative">
            <div className="space-y-2">
              <Heading title={`Closing Voucher`} description="" />
              <Separator />
            </div>
            {!isVoucherShow && tripsInformation.length >= 0 ? (
              <Button
                disabled={tripsInformation.length <= 0}
                onClick={() => setIsVoucherShow(true)}
                className="relative top-[44%] md:mt-0 mt-4"
              >
                Generate Voucher
              </Button>
            ) : (
              <VoucherForm
                busId={busId}
                driverId={driverId}
                voucherNumber={voucherNumber}
                routeId={selectedRoute}
                setTotalExpense={setTotalExpense}
                tripRevenue={tripRevenue}
                TotalExpense={totalExpense}
                setBusId={setBusId}
                setDriverId={setDriverId}
                setIsVoucherShow={setIsVoucherShow}
                setVoucherNumber={setVoucherNumber}
                date={selectedDate?.toISOString()}
                conductorId={conductorId}
                setConductorId={setConductorId}
                setSelectedRoute={setSelectedRoute}
              />
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  )
}
