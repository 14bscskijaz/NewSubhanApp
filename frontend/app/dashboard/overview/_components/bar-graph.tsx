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

  const getCityAbbreviation = (city: string): string => {
    // Predefined abbreviations
    const cityAbbreviations: Record<string, string> = {
      'Faisalabad': 'FSD',
      'Lahore': 'LHR',
      'Islamabad': 'ISB',
      'Karachi': 'KHI',
      'Multan': 'MUX',
      'Peshawar': 'PEW',
      'Quetta': 'UET',
      'Rawalpindi': 'RWP',
      'Sialkot': 'SKT',
      'Gujranwala': 'GUJ',
      'Hyderabad': 'HYD',
    }
  
    // Return predefined abbreviation if available
    if (cityAbbreviations[city]) {
      return cityAbbreviations[city]
    }
  
    // If not predefined, take the first 3 letters in uppercase
    return city.substring(0, 3).toUpperCase()
  }
  
  const aggregatedData = React.useMemo(() => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
  
    const routeMap = new Map<number, Route>()
    routes.forEach((route) => routeMap.set(route.id, route))
  
    const aggregation = new Map<string, number>()
    tripInfo.forEach((trip) => {
      const tripDate = trip.date ? new Date(trip.date) : null
      if (
        tripDate &&
        trip.routeId !== null &&
        trip.passengerCount !== null &&
        tripDate.getMonth() === currentMonth &&
        tripDate.getFullYear() === currentYear
      ) {
        const route = routeMap.get(trip.routeId)
        if (route) {
          // Get dynamic abbreviations
          const sourceAbbr = getCityAbbreviation(route.sourceCity)
          const destAbbr = getCityAbbreviation(route.destinationCity)
          const key = `${sourceAbbr}-${destAbbr}`
  
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
    <Card className='border rounded-xl bg-gradient-border min-h-[570.41px]'>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium"><span className='text-gradient font-medium'>Route</span> Analysis</h3>
          <Select
            value={selectedRoute}
            onValueChange={setSelectedRoute}
          >
            <SelectTrigger className="w-[320px] border bg-gradient-border ">
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
      <CardContent className="px-2 sm:p-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[450px] w-full">
          <BarChart
            data={filteredData}
            margin={{
              left: -10,
              right: 36,
              top: 0,
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
              angle={20} 
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

