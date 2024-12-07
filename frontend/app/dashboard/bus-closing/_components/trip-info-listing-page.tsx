'use client'

import { getAllBuses } from '@/app/actions/bus.action'
import { getAllEmployees } from '@/app/actions/employee.action'
import { getAllRoutes } from '@/app/actions/route.action'
import PageContainer from '@/components/layout/page-container'
import InputField from '@/components/ui/InputField'
import SelectField from '@/components/ui/SelectField'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'; // Import your custom DatePicker
import { Heading } from '@/components/ui/heading'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Buses, allBuses, setBus } from '@/lib/slices/bus-slices'
import { Employee, allEmployees, setEmployee } from '@/lib/slices/employe-slices'
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices'
import { Route, allRoutes, setRoute } from '@/lib/slices/route-slices'
import { TripInformation, allTripsInformation } from '@/lib/slices/trip-information'
import { RootState } from '@/lib/store'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NewRouteDialog from './new-trip-info-dialogue'
import RouteTable from './trip-info-tables'
import VoucherForm from './voucher-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RouteListingPage() {
  const tripsInformation = useSelector<RootState, TripInformation[]>(allTripsInformation)
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const employees = useSelector<RootState, Employee[]>(allEmployees);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);

  const [voucherNumber, setVoucherNumber] = useState<string>('');
  const [conductorId, setConductorId] = useState<string>('');
  const [driverId, setDriverId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pageLimit, setPageLimit] = useState(5)
  const [busId, setBusId] = useState<string>('')
  const [isVoucherShow, setIsVoucherShow] = useState(false)
  const [tripRevenue, setTripRevenue] = useState<string>('')
  const [totalExpense, setTotalExpense] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRoute, setSelectedRoute] = useState<string>('');

  const searchParams = useSearchParams()

  const dispatch = useDispatch();

  const fetchAllData = async () => {
    const allBuses = await getAllBuses();
    const allEmployees = await getAllEmployees();
    const allRoutes = await getAllRoutes();
    dispatch(setRoute(allRoutes));
    dispatch(setEmployee(allEmployees));
    dispatch(setBus(allBuses));
  }
  useEffect(() => {
    fetchAllData();
  }, [])

  useEffect(() => {
    const pageParam = searchParams.get('page') || '1'
    const searchParam = searchParams.get('q') || ''
    const limitParam = searchParams.get('limit') || '5'

    setPage(Number(pageParam))
    setSearch(searchParam)
    setPageLimit(Number(limitParam))
  }, [searchParams])

  useEffect(() => {
    const totalRevenue = tripsInformation.reduce((total, route) => {
      return total + (Number(route.actualRevenue) || 0)
    }, 0)

    setTripRevenue(totalRevenue.toFixed(2))
  }, [tripsInformation])



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
            id="driver"
            label="Driver"
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
            label="Conductor"
            value={conductorId}
            onChange={setConductorId}
            placeholder="Select Conductor"
            options={conductors.map((conductor) => ({
              value: conductor.id.toString(),
              label: `${conductor.firstName} ${conductor.lastName}`,
            }))}
          />
          <SelectField
            id="route"
            label="Select Route"
            value={selectedRoute}
            onChange={setSelectedRoute}
            placeholder="Select Route"
            options={filterTicketRoutes.map((route) => ({
              value: route.id.toString(),
              label: `${route.sourceCity} (${route.sourceAdda}) - ${route.destinationCity} (${route.destinationAdda})`,
            }))}
            className=""
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
                />
              </div>
              <Separator />
            </div>
            <RouteTable data={paginatedRoutes} totalData={totalUsers} />
            {parseInt(tripRevenue) > 0 && (
              <div className="mt-4 flex md:justify-end justify-start text-lg">
                <span className="text-gradient font-bold">Total Revenue</span>: {tripRevenue}
              </div>
            )}
          </div>
          <div className='w-[1px] h-full left-[45.6%] bg-neutral-200 absolute hidden md:block'></div>
          <Separator className='md:hidden'/>
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
              />
            )}
          </div>
        </div>

      </div>
    </PageContainer>
  )
}
