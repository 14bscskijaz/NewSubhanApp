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

export default function RouteListingPage() {
  const tripsInformation = useSelector<RootState, TripInformation[]>(allTripsInformation)
  const buses = useSelector<RootState, Buses[]>(allBuses)
  const employees = useSelector<RootState, Employee[]>(allEmployees)
  const routes = useSelector<RootState, Route[]>(allRoutes)
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw)

  const [voucherNumber, setVoucherNumber] = useState<string>('')
  const [driverId, setDriverId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pageLimit, setPageLimit] = useState(10)
  const [busId, setBusId] = useState<string>('')
  const [isVoucherShow, setIsVoucherShow] = useState(false)
  const [tripRevenue, setTripRevenue] = useState<string>('')
  const [totalExpense, setTotalExpense] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

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
    const limitParam = searchParams.get('limit') || '10'

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
              className="w-[300px]"
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
        </div>
        <div className="flex">
          <div className='flex items-start gap-4'>
            <Heading title={`Trips (${totalUsers})`} description="" />
            <NewRouteDialog
              busId={busId}
              voucherNumber={voucherNumber}
              driverId={driverId}
            />
          </div>
          <div className='relative left-[37%] hidden md:block'>
            <Heading title={`Closing Voucher`} description="" />
          </div>

        </div>
        <div className="flex gap-10">
          <Separator className="w-[49%]" />
          <Separator className="w-[49%]" />
        </div>


        <div className="flex items-start md:flex-row flex-col gap-x-5">
          <div className="md:w-[50%] w-[100%]">
            <RouteTable data={paginatedRoutes} totalData={totalUsers} />
            {parseInt(tripRevenue) > 0 && (
              <div className="mt-4 flex md:justify-end justify-start  text-lg">
                <span className="text-gradient font-bold">Total Revenue</span>: {tripRevenue}
              </div>
            )}
          </div>
          <div className='relative mb-2 mt-4 md:hidden '>
            <Heading title={`Closing Voucher`} description="" />
          </div>
          <div className="md:w-[1px] w-[100%] h-[1px] relative mt-4 md:bottom-20 md:h-[28rem] bg-neutral-200"></div>
          <div className="md:w-[50%] w-[100%] ">
            {!isVoucherShow ? (
              <Button
                disabled={tripsInformation.length <= 0}
                onClick={() => setIsVoucherShow(true)}
                className='relative md:mt-0 mt-4'
              >
                Generate Voucher
              </Button>
            ) : (
              <VoucherForm
                busId={busId}
                driverId={driverId}
                voucherNumber={voucherNumber}
                setTotalExpense={setTotalExpense}
                tripRevenue={tripRevenue}
                TotalExpense={totalExpense}
              />
            )}
            {/* {isVoucherShow && (
              <NetExpenses
                tripRevenue={tripRevenue}
                TotalExpense={totalExpense}
              />
            )} */}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
