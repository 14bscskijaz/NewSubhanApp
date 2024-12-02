import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TicketPrice, TicketPriceRaw, addTicketRaw } from "@/lib/slices/pricing-slices"
import { Route, allRoutes } from "@/lib/slices/route-slices"
import { RootState } from "@/lib/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTicketPrice } from "@/app/actions/pricing.action"

export default function NewPricingDialog() {
  const routes = useSelector<RootState, Route[]>(allRoutes)
  const [open, setOpen] = useState(false)
  const [routeId, setRouteId] = useState<number | "">("")
  const [ticketPrice, setTicketPrice] = useState<number | "">("")
  const [busType, setBusType] = useState("")

  const dispatch = useDispatch()

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newTicket: TicketPriceRaw = {
      id: Date.now(),
      routeId: Number(routeId),
      ticketPrice: Number(ticketPrice),
      busType,
    }
    await createTicketPrice(newTicket)
    dispatch(addTicketRaw(newTicket))
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setRouteId("")
    setTicketPrice("")
    setBusType("")
  }

  const handleRouteChange = (value: string) => {
    setRouteId(Number(value)) // Store only the routeId
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[400px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New <span className="text-gradient">Ticket Price</span></DialogTitle>
            <DialogDescription>
              Enter the details of the new Ticket Price here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            {/* Route Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="route" className="text-gradient">Route</Label>
              <Select onValueChange={handleRouteChange}>
                <SelectTrigger id="route">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem
                      key={route.id}
                      value={`${route.id}`} 
                    >
                      {route.sourceCity} ({route.sourceAdda}) - {route.destinationCity} ({route.destinationAdda})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Ticket Price Input */}
            <div className="grid gap-2">
              <Label htmlFor="ticketPrice">Ticket Price</Label>
              <Input
                id="ticketPrice"
                placeholder="Enter ticket price"
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value === "" ? "" : parseInt(e.target.value))}
              />
            </div>
            {/* Bus Type Dropdown */}
            <div className="grid gap-2">
              <Label htmlFor="busType">Bus <span className="text-gradient">Type</span></Label>
              <Select onValueChange={setBusType}>
                <SelectTrigger id="busType">
                  <SelectValue placeholder="Select Bus Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Ticket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
