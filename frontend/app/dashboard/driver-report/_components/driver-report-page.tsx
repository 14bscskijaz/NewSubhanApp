"use client"

import { getAllBusClosingVouchers } from "@/app/actions/BusClosingVoucher.action"
import { getAllBuses } from "@/app/actions/bus.action"
import { getAllEmployees } from "@/app/actions/employee.action"
import { getAllTrips } from "@/app/actions/trip.action"
import { getAllRoutes } from "@/app/actions/route.action"
import PageContainer from "@/components/layout/page-container"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import useAccounting from "@/hooks/useAccounting"
import { type BusClosingVoucher, allBusClosingVouchers, setBusClosingVoucher } from "@/lib/slices/bus-closing-voucher"
import { type Buses, allBuses, setBus } from "@/lib/slices/bus-slices"
import { type Employee, allEmployees, setEmployee } from "@/lib/slices/employe-slices"
import {
  type SavedTripInformation,
  allSavedsavedTripsInformation,
  setSavedTripInformation,
} from "@/lib/slices/trip-information-saved"
import { type Route, allRoutes, setRoute } from "@/lib/slices/route-slices"
import type { RootState } from "@/lib/store"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { printExpenses } from "./print"
import TripTable from "./trip-tables"

export default function DriverReportPage() {
  const { formatNumber } = useAccounting()

  const tripInfo = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation)
  const vouchers = useSelector<RootState, BusClosingVoucher[]>(allBusClosingVouchers)
  const buses = useSelector<RootState, Buses[]>(allBuses)
  const routes = useSelector<RootState, Route[]>(allRoutes)
  const employees = useSelector<RootState, Employee[]>(allEmployees)

  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)
  const dispatch = useDispatch()

  const busBrandFilter = searchParams.get("busBrand")
  const routeFilter = searchParams.get("route")
  const driverFilterId = searchParams.get("driver")
  const dateParam = searchParams.get("date")

  useEffect(() => {
    const fetchData = async () => {
      const [allBus, allVoucher, allEmployees, allTrips, allRoutes] = await Promise.all([
        getAllBuses(),
        getAllBusClosingVouchers(),
        getAllEmployees(),
        getAllTrips(),
        getAllRoutes(),
      ])

      dispatch(setBus(allBus))
      dispatch(setBusClosingVoucher(allVoucher))
      dispatch(setEmployee(allEmployees))
      dispatch(setSavedTripInformation(allTrips))
      dispatch(setRoute(allRoutes))
    }

    fetchData()

    const pageParam = searchParams.get("page")
    if (pageParam) {
      setPage(Number(pageParam))
    }
    const pageLimitParam = searchParams.get("pageLimit")
    if (pageLimitParam) {
      setPageLimit(Number(pageLimitParam))
    }
  }, [dispatch, searchParams])

  const driverMetrics = useCallback(() => {
    let startDate: Date | null = null
    let endDate: Date | null = null
    if (dateParam) {
      const dates = dateParam.split("|")
      startDate = dates[0] ? new Date(dates[0]) : null
      endDate = dates[1] ? new Date(dates[1]) : null
    }

    const aggregatedData = new Map<
      string,
      {
        driver: string
        busTypes: Set<string>
        busBrand: string
        tripCount: number
        totalDiesel: number
        voucherIds: Set<string>
      }
    >()

    let routeSourceCity = ""
    let routeDestinationCity = ""
    if (routeFilter) {
      const [source, destination] = routeFilter.split("-")
      routeSourceCity = source.trim().toLowerCase()
      routeDestinationCity = destination.trim().toLowerCase()
    }

    const validVouchers = vouchers.filter((voucher) => {
      // Convert UTC voucher date to local time
      const voucherDate = new Date(voucher.date)
      const localVoucherDate = new Date(
        voucherDate.getUTCFullYear(),
        voucherDate.getUTCMonth(),
        voucherDate.getUTCDate(),
        voucherDate.getUTCHours(),
        voucherDate.getUTCMinutes(),
        voucherDate.getUTCSeconds()
      )

      if (startDate) {
        // Convert startDate to local time
        const localStartDate = new Date(
          startDate.getUTCFullYear(),
          startDate.getUTCMonth(),
          startDate.getUTCDate(),
          startDate.getUTCHours(),
          startDate.getUTCMinutes(),
          startDate.getUTCSeconds()
        )

        if (endDate) {
          // Convert endDate to local time
          const localEndDate = new Date(
            endDate.getUTCFullYear(),
            endDate.getUTCMonth(),
            endDate.getUTCDate(),
            endDate.getUTCHours(),
            endDate.getUTCMinutes(),
            endDate.getUTCSeconds()
          )

          if (localVoucherDate < localStartDate || localVoucherDate > localEndDate) return false
        } else {
          // Single date filter
          if (
            localVoucherDate.getFullYear() !== localStartDate.getFullYear() ||
            localVoucherDate.getMonth() !== localStartDate.getMonth() ||
            localVoucherDate.getDate() !== localStartDate.getDate()
          ) {
            return false
          }
        }
      }

      if (driverFilterId && Number(voucher.driverId) !== Number(driverFilterId)) return false

      const bus = buses.find((b) => b.id === voucher.busId)
      if (busBrandFilter && bus?.busBrand !== busBrandFilter) return false

      return true
    })

    validVouchers.forEach((voucher) => {
      const relatedTrips = tripInfo.filter((trip) => trip.routeClosingVoucherId === voucher.id)

      if (routeFilter) {
        const hasMatchingRoute = relatedTrips.some((trip) => {
          const route = routes.find((r) => r.id === trip.routeId)
          return (
            route &&
            route.sourceCity.toLowerCase().includes(routeSourceCity) &&
            route.destinationCity.toLowerCase().includes(routeDestinationCity)
          )
        })
        if (!hasMatchingRoute) return
      }

      const bus = buses.find((b) => b.id === voucher.busId)
      const driver = employees.find((e) => Number(e.id) === Number(voucher.driverId))

      if (!bus || !driver) return

      const key = `${driver.id}-${bus.busBrand}`
      const driverName = `${driver.firstName} ${driver.lastName}`

      if (!aggregatedData.has(key)) {
        aggregatedData.set(key, {
          driver: driverName,
          busTypes: new Set([bus.busType]),
          busBrand: bus.busBrand,
          tripCount: 0,
          totalDiesel: 0,
          voucherIds: new Set(),
        })
      }

      const data = aggregatedData.get(key)!
      data.busTypes.add(bus.busType)
      data.voucherIds.add(voucher.id.toString())
      data.tripCount = data.voucherIds.size
      data.totalDiesel += voucher.dieselLitres || 0
    })

    return Array.from(aggregatedData.values()).map((data) => ({
      driver: data.driver,
      busType: Array.from(data.busTypes).join(", "),
      busBrand: data.busBrand,
      trips: formatNumber(data.tripCount),
      diesel: formatNumber(data.totalDiesel),
    }))
  }, [
    tripInfo,
    vouchers,
    buses,
    employees,
    routes,
    busBrandFilter,
    routeFilter,
    driverFilterId,
    dateParam,
    formatNumber,
  ])

  const driverData = driverMetrics()
  const totalDriverReport = driverData.length
  const startIndex = (page - 1) * pageLimit
  const endIndex = startIndex + pageLimit
  const paginatedDrivers = driverData.slice(startIndex, endIndex)

  const handlePrint = useCallback(() => {
    const filterEmployee = employees?.find((emp) => Number(emp?.id) === Number(driverFilterId))
    return printExpenses(
      driverData as any,
      filterEmployee,
      dateParam??undefined,
      busBrandFilter as any,
      routeFilter as any,
    )
  }, [driverData, employees, driverFilterId, dateParam, busBrandFilter, routeFilter])

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div></div>
        <div className="flex items-start justify-between">
          <Heading title={`Driver Report (${totalDriverReport})`} description="" />
        </div>
        <Separator />
        <TripTable data={paginatedDrivers} totalData={totalDriverReport} printExpenses={handlePrint} />
      </div>
    </PageContainer>
  )
}