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
import { Expense, addExpense } from "@/lib/slices/expenses-slices"
import { RootState } from "@/lib/store"; // Adjust the path as needed
import { Plus } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function NewExpensesDialog() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"bus" | "general">("general")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState<number | "">("")
  const [busId, setBusId] = useState<number | "">("")  
  
  const dispatch = useDispatch()

  // Get buses from Redux state
  const buses = useSelector((state: RootState) => state.buses.buses)

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();  
  
    const newExpense: Omit<Expense, 'id'> = {
      date:new Date().toUTCString(),
      description,
      amount: Number(amount),
      busId: busId !== "" ? Number(busId) : undefined,  
      type: tab, 
    };
  
    dispatch(addExpense(newExpense));
  
    setOpen(false);
    resetForm();
  }
  
  // Reset form values
  const resetForm = () => {
    setDescription("")
    setAmount("")
    setBusId("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[400px] overflow-y-auto custom-scrollbar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New <span className="text-gradient">Expense</span></DialogTitle>
            <DialogDescription>
              Enter the details of the new Expense here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
         {/* Custom Tab Buttons */}
         <div className="flex space-x-4 my-4">
            <div
              className={`cursor-pointer px-4 py-2 rounded-lg text-center transition-all ${
                tab === "bus" ? "bg-gradient-btn text-white" : "bg-gray-200 text-gray-600"
              } hover:bg-gradient-btn hover:opacity-60 hover:text-white`}
              onClick={() => setTab("bus")}
            >
              Bus
            </div>
            <div
              className={`cursor-pointer px-4 py-2 rounded-lg text-center transition-all ${
                tab === "general" ? "bg-gradient-btn text-white" : "bg-gray-200 text-gray-600"
              } hover:bg-gradient-btn hover:opacity-60 hover:text-white`}
              onClick={() => setTab("general")}
            >
              General
            </div>
          </div>

          <div className="grid gap-6 py-6">
            {/* Bus Tab */}
            {tab === "bus" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="busId">Select Bus</Label>
                  <Select onValueChange={(value) => setBusId(Number(value))}>
                    <SelectTrigger id="busId">
                      <SelectValue placeholder="Select Bus" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Map buses from Redux */}
                      {buses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id.toString()}>
                          {bus.busNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  />
                </div>
              </>
            )}

            {/* General Tab */}
            {tab === "general" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Save Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
