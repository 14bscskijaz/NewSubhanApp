import * as React from 'react'
import { CartesianGrid, XAxis, YAxis, LineChart, Line, ResponsiveContainer } from 'recharts'
import {
    Card,
    CardContent,
    CardHeader
} from '@/components/ui/card'
import { addDays, format, startOfWeek, endOfWeek, isWithinInterval, parseISO, eachDayOfInterval, startOfMonth, endOfMonth, eachWeekOfInterval, subMonths, addMonths, subYears, addYears } from "date-fns"
import {
    ChartContainer,
    ChartTooltip,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface DailyData {
    date: string
    passengerCount: number
}

interface WeekData {
    startDate: Date
    endDate: Date
    label: string
}

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
                    <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                    <span className="font-bold">{data.date}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">Passengers</span>
                    <span className="font-bold">{data.passengerCount}</span>
                </div>
            </div>
        </div>
    )
}

export function LineGraph() {
    const tripInfo = useSelector<RootState, SavedTripInformation[]>(allSavedsavedTripsInformation)
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
    const [selectedWeek, setSelectedWeek] = React.useState<string>('')
    const [isYearView, setIsYearView] = React.useState<boolean>(false)

    const monthStart = React.useMemo(() => startOfMonth(selectedDate), [selectedDate])
    const monthEnd = React.useMemo(() => endOfMonth(selectedDate), [selectedDate])

    const weeklyData = React.useMemo(() => {
        const weeks: WeekData[] = eachWeekOfInterval(
            { start: monthStart, end: monthEnd },
            { weekStartsOn: 1 }
        ).map(weekStart => {
            const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
            return {
                startDate: weekStart,
                endDate: weekEnd > monthEnd ? monthEnd : weekEnd,
                label: `${format(weekStart, 'MMM d')} - ${format(weekEnd > monthEnd ? monthEnd : weekEnd, 'MMM d')}`
            }
        })

        return weeks
    }, [monthStart, monthEnd])

    React.useEffect(() => {
        if (weeklyData.length > 0) {
            const currentDate = new Date();
            const currentWeek = weeklyData.find(week => 
                isWithinInterval(currentDate, { start: week.startDate, end: week.endDate })
            );
            setSelectedWeek(currentWeek ? currentWeek.label : weeklyData[0].label);
        }
    }, [weeklyData]);

    const dailyData = React.useMemo(() => {
        if (!tripInfo?.length || !selectedWeek) return []

        const selectedWeekData = weeklyData.find(week => week.label === selectedWeek)
        if (!selectedWeekData) return []

        const dailyAggregation = new Map<string, number>()

        const daysInWeek = eachDayOfInterval({
            start: selectedWeekData.startDate,
            end: selectedWeekData.endDate
        })

        daysInWeek.forEach(day => {
            const dateKey = format(day, 'MMM d')
            dailyAggregation.set(dateKey, 0)
        })

        tripInfo.forEach((trip) => {
            if (trip.passengerCount !== null && trip.date) {
                const tripDate = parseISO(trip.date)
                if (isWithinInterval(tripDate, { start: selectedWeekData.startDate, end: selectedWeekData.endDate })) {
                    const dateKey = format(tripDate, 'MMM d')
                    dailyAggregation.set(dateKey, (dailyAggregation.get(dateKey) || 0) + trip.passengerCount)
                }
            }
        })

        return Array.from(dailyAggregation.entries())
            .map(([date, passengerCount]) => ({
                date,
                passengerCount,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [tripInfo, selectedWeek, weeklyData])

    const chartConfig = {
        passengerCount: {
            label: 'Passenger Count',
            color: 'hsl(var(--chart-1))',
        },
    }

    const handlePreviousMonth = () => {
        setSelectedDate(prevDate => subMonths(prevDate, 1))
        setSelectedWeek('')
    }

    const handleNextMonth = () => {
        setSelectedDate(prevDate => addMonths(prevDate, 1))
        setSelectedWeek('')
    }

    const handlePreviousYear = () => {
        setSelectedDate(prevDate => subYears(prevDate, 1))
        setSelectedWeek('')
    }

    const handleNextYear = () => {
        setSelectedDate(prevDate => addYears(prevDate, 1))
        setSelectedWeek('')
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-medium">Weekly Passenger Count</h3>
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center">
                                <Button
                                    variant="outline"
                                    className='bg-gradient-2 text-white'
                                    size="icon"
                                    onClick={isYearView ? handlePreviousYear : handlePreviousMonth}
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </Button>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-[200px] justify-start text-left font-normal mx-2`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {format(selectedDate, isYearView ? "yyyy" : "MMMM yyyy")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <div className="flex">
                                            <div className="border-r p-2">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {Array.from({ length: 12 }, (_, i) => {
                                                        const date = new Date(selectedDate.getFullYear(), i, 1)
                                                        return (
                                                            <Button
                                                                key={i}
                                                                variant={selectedDate.getMonth() === i && !isYearView ? "default" : "ghost"}
                                                                className="p-2"
                                                                onClick={() => {
                                                                    setSelectedDate(date)
                                                                    setSelectedWeek('')
                                                                    setIsYearView(false)
                                                                }}
                                                            >
                                                                {format(date, "MMM")}
                                                            </Button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <div className="flex flex-col gap-2">
                                                    {[-2, -1, 0, 1, 2].map((offset) => {
                                                        const year = selectedDate.getFullYear() + offset
                                                        return (
                                                            <Button
                                                                key={year}
                                                                variant={selectedDate.getFullYear() === year && isYearView ? "default" : "ghost"}
                                                                className="p-2"
                                                                onClick={() => {
                                                                    setSelectedDate(new Date(year, selectedDate.getMonth(), 1))
                                                                    setSelectedWeek('')
                                                                    setIsYearView(true)
                                                                }}
                                                            >
                                                                {year}
                                                            </Button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <Button
                                    variant="outline"
                                    className='bg-gradient-2 text-white'
                                    size="icon"
                                    onClick={isYearView ? handleNextYear : handleNextMonth}
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            <Select
                                value={selectedWeek}
                                onValueChange={setSelectedWeek}
                            >
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select a week" />
                                </SelectTrigger>
                                <SelectContent>
                                    {weeklyData.map((week) => (
                                        <SelectItem key={week.label} value={week.label}>
                                            {week.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                    <ChartContainer config={chartConfig} className="aspect-auto h-[340px] w-full">
                        <LineChart
                            data={dailyData}
                            margin={{
                                left: 10,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <YAxis
                                axisLine={true}
                                tickFormatter={(value) => value.toLocaleString()}
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={true}
                                tickMargin={8}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <Line
                                type="monotone"
                                dataKey="passengerCount"
                                stroke="#178F74"
                                strokeWidth={2}
                                dot={{ fill: "#178F74", r: 4 }}
                                activeDot={{ r: 6, fill: "#178F74" }}
                            />
                            <ChartTooltip
                                cursor={{ stroke: "#666", strokeWidth: 1 }}
                                content={<CustomTooltip />}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}

