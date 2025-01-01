import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, LabelList, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { SavedTripInformation, allSavedsavedTripsInformation } from '@/lib/slices/trip-information-saved'
import { Route, allRoutes } from '@/lib/slices/route-slices'

interface ChartData {
  route: string
  passengerCount: number
}

// Custom tooltip component
const CustomTooltip: React.FC<{
  active?: boolean
  payload?: any[]
}> = ({ active, payload }) => {
  if (!active || !payload?.length) return null

  const data = payload[0].payload
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Route
          </span>
          <span className="font-bold">{data.route}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Passengers
          </span>
          <span className="font-bold">{data.passengerCount}</span>
        </div>
      </div>
    </div>
  )
}

export function BarGraph() {
  const tripInfo = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation)
  const routes = useSelector<RootState, Route[]>(allRoutes)
  const [selectedRoute, setSelectedRoute] = React.useState<string>('all')

  const aggregatedData = React.useMemo(() => {
    const routeMap = new Map<number, Route>()
    routes.forEach((route) => routeMap.set(route.id, route))

    const aggregation = new Map<string, number>()
    tripInfo.forEach((trip) => {
      if (trip.routeId !== null && trip.passengerCount !== null) {
        const route = routeMap.get(trip.routeId)
        if (route) {
          const key = `${route.sourceCity}-${route.destinationCity}`
          aggregation.set(key, (aggregation.get(key) || 0) + trip.passengerCount)
        }
      }
    })

    return Array.from(aggregation.entries()).map(([route, passengerCount]) => ({
      route,
      passengerCount,
    }))
  }, [tripInfo, routes]) as ChartData[]

  // Get unique routes for the select dropdown
  const uniqueRoutes = React.useMemo(() => {
    return ['all', ...new Set(aggregatedData.map(item => item.route))]
  }, [aggregatedData])

  // Filter data based on selected route
  const filteredData = React.useMemo(() => {
    if (selectedRoute === 'all') return aggregatedData
    return aggregatedData.filter(item => item.route === selectedRoute)
  }, [aggregatedData, selectedRoute])

  const chartConfig = {
    passengerCount: {
      label: 'Passenger Count by Route',
      color: 'hsl(var(--chart-1))',
    },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Route Analysis</h3>
          <Select
            value={selectedRoute}
            onValueChange={setSelectedRoute}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a route" />
            </SelectTrigger>
            <SelectContent>
              {uniqueRoutes.map((route) => (
                <SelectItem key={route} value={route}>
                  {route === 'all' ? 'All Routes' : route}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[390px] w-full">
          <BarChart
            data={filteredData}
            margin={{
              left: 10,
              right: 12,
              top: 10,
              bottom: 50
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis axisLine={true}/>
            <XAxis 
              dataKey="route" 
              tickLine={false} 
              axisLine={true} 
              tickMargin={8} 
              minTickGap={32}
              angle={30} 
              textAnchor="center"
            />
            <Bar 
              dataKey="passengerCount" 
              fill="#178F74"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            >
              <LabelList 
                dataKey="passengerCount" 
                position="top" 
                style={{ 
                  fill: 'var(--foreground)',
                  fontSize: '14px',
                }}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Bar>
            <ChartTooltip 
              cursor={{ fillOpacity: 0 }}
              content={<CustomTooltip />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

