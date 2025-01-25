"use client"

import { getAllFixedTripExpenses } from "@/app/actions/FixedTripExpense.action"
import PageContainer from "@/components/layout/page-container"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { type FixedTripExpense, allFixedTripExpenses, setFixedTripExpense } from "@/lib/slices/fixed-trip-expense"
import type { RootState } from "@/lib/store"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import NewTripDialog from "./new-trip-dialogue"
import TripTable from "./trip-tables"
import { type Route, allRoutes, setRoute } from "@/lib/slices/route-slices"
import { type TicketPriceRaw, allTicketsRaw, setTicketRaw } from "@/lib/slices/pricing-slices"
import { getAllTicketPrices } from "@/app/actions/pricing.action"
import { getAllRoutes } from "@/app/actions/route.action"
import { useToast } from "@/hooks/use-toast"

type TTripListingPage = {}

export default function TripListingPage({}: TTripListingPage) {
  const trips = useSelector<RootState, FixedTripExpense[]>(allFixedTripExpenses)
  const routes = useSelector<RootState, Route[]>(allRoutes)
  const tickets = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw)
  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [source, setSource] = useState("")
  const [pageLimit, setPageLimit] = useState(10)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false)

  useEffect(() => {
    const fetchFixedTripExpense = async () => {
      if (isInitialFetchDone) return
      try {
        const fetchFixedExpense = await getAllFixedTripExpenses()
        const routes = await getAllRoutes()
        const tickets = await getAllTicketPrices()

        dispatch(setFixedTripExpense(fetchFixedExpense))
        dispatch(setRoute(routes))
        dispatch(setTicketRaw(tickets))

        setIsInitialFetchDone(true)
      } catch (error: any) {
        console.error(error.message)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: 1000,
        })
      }
    }

    fetchFixedTripExpense()

    const pageParam = searchParams.get("page") || "1"
    const searchParam = searchParams.get("q") || ""
    const countParam = searchParams.get("count") || ""
    const limitParam = searchParams.get("limit") || "10"

    setPage(Number(pageParam))
    setSearch(searchParam)
    setSource(countParam)
    setPageLimit(Number(limitParam))
  }, [dispatch, searchParams, toast])

  const filteredTrip = trips.filter((trip) => {
    const route = routes.find((r) => r.id === trip.routeId)
    const searchLower = search.toLowerCase()
    const sourceLower = source.toLowerCase()

    const matchesSearch = search
      ? trip.routeCommission.toString().includes(searchLower) ||
        trip.rewardCommission.toString().includes(searchLower) ||
        trip.steward.toString().includes(searchLower) ||
        trip.counter.toString().includes(searchLower) ||
        trip.dcParchi.toString().includes(searchLower) ||
        trip.refreshment.toString().includes(searchLower) ||
        route?.sourceCity.toLowerCase().includes(searchLower) ||
        route?.destinationCity.toLowerCase().includes(searchLower) ||
        route?.sourceAdda.toLowerCase().includes(searchLower) ||
        route?.destinationAdda.toLowerCase().includes(searchLower)
      : true

    const matchesCount = source
      ? trip.routeCommission.toString() === sourceLower ||
        trip.rewardCommission.toString() === sourceLower ||
        trip.steward.toString() === sourceLower ||
        trip.counter.toString() === sourceLower ||
        trip.dcParchi.toString() === sourceLower ||
        trip.refreshment.toString() === sourceLower ||
        route?.sourceCity.toLowerCase().includes(sourceLower) ||
        route?.destinationCity.toLowerCase().includes(sourceLower) ||
        route?.sourceAdda.toLowerCase().includes(sourceLower) ||
        route?.destinationAdda.toLowerCase().includes(sourceLower)
      : true

    return matchesSearch && matchesCount
  })

  const totalTripExpense = filteredTrip.length

  const startIndex = (page - 1) * pageLimit
  const endIndex = startIndex + pageLimit
  const paginatedTrips = filteredTrip.slice(startIndex, endIndex)

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Trip Expense (${totalTripExpense})`} description="" />
          <NewTripDialog />
        </div>
        <Separator />
        <TripTable data={paginatedTrips} totalData={totalTripExpense} />
      </div>
    </PageContainer>
  )
}

