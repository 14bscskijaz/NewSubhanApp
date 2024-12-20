import { createTicketPrice, getAllTicketPrices } from "@/app/actions/pricing.action"
import SelectField from "@/components/ui/SelectField"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { TicketPriceRaw, setTicketRaw } from "@/lib/slices/pricing-slices"
import { Route, allRoutes } from "@/lib/slices/route-slices"
import { RootState } from "@/lib/store"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function NewPricingDialog() {
  const routes = useSelector<RootState, Route[]>(allRoutes)
  const [open, setOpen] = useState(false)
  const [routeId, setRouteId] = useState<number | "">("")
  const [ticketPrice, setTicketPrice] = useState<number | "">("")
  const [busType, setBusType] = useState("")
  const {toast} = useToast();

  const dispatch = useDispatch()

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
  
      const newTicket: Omit<TicketPriceRaw,"id"> = {
        routeId: Number(routeId),
        ticketPrice: Number(ticketPrice),
        busType,
      }
      console.log(newTicket,"Tice");
      
      await createTicketPrice(newTicket)
      console.log("Data submmit");
      
      const allTicketData = await getAllTicketPrices()
      dispatch(setTicketRaw(allTicketData))
      // dispatch(addTicketRaw(newTicket))
      toast({
        title:"Success",
        description:"New Ticket Price Added successfully",
        variant:"default",
        duration:1000
      })
      setOpen(false)
      resetForm()
      
    } catch (error:any) {
      console.error(error.message);
      
      toast({
        title:"Error",
        description:error.message,
        variant:"destructive",
        duration:1000
      })
    }
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
            <SelectField
              id="route"
              label="Select Route"
              value={routeId.toString()}
              onChange={handleRouteChange}
              placeholder="Select Route"
              options={routes.map((route) => ({
                value: route.id.toString(),
                label: `${route.sourceCity} (${route.sourceAdda}) - ${route.destinationCity} (${route.destinationAdda})`,
              }))}
              className="flex-col !items-start !space-x-0"
            />
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
                  <SelectItem value="Business">Business</SelectItem>
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
