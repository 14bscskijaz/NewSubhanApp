"use client"

import { Buses, allBuses } from "@/lib/slices/bus-slices"
import { RootState } from "@/lib/store"
import { useSelector } from "react-redux"

export function useBusNumber(busId?:number) {
    const buses = useSelector<RootState,Buses[]>(allBuses);
    const filterBus = buses.find(bus=>Number(bus.id)==Number(busId));
    return filterBus?.busNumber
}