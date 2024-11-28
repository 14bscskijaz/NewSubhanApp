'use client'

import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { BusClosing, allBusClosings } from '@/lib/slices/bus-closing'
import { Buses, allBuses } from '@/lib/slices/bus-slices'
import { Employee, allEmployees } from '@/lib/slices/employe-slices'
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices'
import { Route, allRoutes } from '@/lib/slices/route-slices'
import { RootState } from '@/lib/store'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NewRouteDialog from './new-trip-info-dialogue'
import RouteTable from './trip-info-tables'
import VoucherForm from './voucher-form'
import NetExpenses from './net-expense'
import SelectField from '@/components/ui/SelectField'
import InputField from '@/components/ui/InputField'
import { allTripsInformation, TripInformation } from '@/lib/slices/trip-information'
import { DatePicker } from '@/components/ui/date-picker' // Import your custom DatePicker

export default function RouteListingPage() {
  const closingRoutes = useSelector<RootState, BusClosing[]>(allBusClosings)
  const tripsInformation = useSelector<RootState, TripInformation[]>(allTripsInformation)
  const buses = useSelector<RootState, Buses[]>(allBuses)
  const employees = useSelector<RootState, Employee[]>(allEmployees)
  const routes = useSelector<RootState, Route[]>(allRoutes)
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw)

  const [routeId, setRouteId] = useState<number>()
  const [voucherNumber, setVoucherNumber] = useState<string>('')
  const [driverId, setDriverId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [pageLimit, setPageLimit] = useState(10)
  const [busId, setBusId] = useState<string>('')
  const [isVoucherShow, setIsVoucherShow] = useState(false)
  const [tripRevenue, setTripRevenue] = useState<string>('')
  const [totalExpense, setTotalExpense] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()) // New state for selected date

  const searchParams = useSearchParams()

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

  const Routes = routes.filter((route) =>
    ticketsRaw.some((ticket) => ticket.routeId === route.id)
  )

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
        <div className="grid grid-cols-3 gap-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-full"
          />

          <SelectField
            id="busNumber"
            label="Bus Number"
            value={busId}
            onChange={setBusId}
            placeholder="Select Bus Number"
            options={buses.map((bus) => ({
              value: bus.id.toString(),
              label: bus.bus_number
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
              .filter((employee) => employee.employee_type === 'Driver')
              .map((employee) => ({
                value: employee.id.toString(),
                label: `${employee.first_name} ${employee.last_name}`
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
          <div className='relative left-[25rem]'>
          <Heading title={`Closing Voucher`} description="" />
          </div>

        </div>
        <div className="flex gap-10">
          <Separator className="w-[49%]" />
          <Separator className="w-[49%]" />
        </div>


        <div className="flex items-start gap-x-5">
          <div className="w-[50%]">
            <RouteTable data={paginatedRoutes} totalData={totalUsers} />
            {parseInt(tripRevenue) > 0 && (
              <div className="mt-4 flex justify-end text-lg">
                <span className="text-gradient font-bold">Total Revenue</span>: {tripRevenue}
              </div>
            )}
          </div>
          <div className="w-[1px] relative bottom-6 h-80 bg-neutral-200"></div>
          <div className="w-[50%]">
            {!isVoucherShow ? (
              <Button
                disabled={tripsInformation.length <= 0}
                onClick={() => setIsVoucherShow(true)}
                className='relative top-24'
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
