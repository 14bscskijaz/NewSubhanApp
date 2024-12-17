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
import { useToast } from "@/hooks/use-toast"
import { Expense, addExpense, allExpenses } from "@/lib/slices/expenses-slices"
import { RootState } from "@/lib/store"; // Adjust the path as needed
import { Plus } from "lucide-react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default function NewExpensesDialog() {
  const [open, setOpen] = useState(false);
  const expenses = useSelector<RootState, Expense[]>(allExpenses);
  const [tab, setTab] = useState<"bus" | "general">("general")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState<number | "">("")
  const [busId, setBusId] = useState<string | number>("")
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);  // Loading state

  const dispatch = useDispatch()

  // Get buses from Redux state
  const buses = useSelector((state: RootState) => state.buses.buses)

  // Handle form submission with validation and loading state
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form validation
    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required.",
        variant: "destructive",
        duration: 1000
      });
      return;
    }

    if (!amount || amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Amount must be a positive number.",
        variant: "destructive",
        duration: 1000
      });
      return;
    }

    setIsLoading(true);  // Start loading

    try {
      const newExpense: Omit<Expense, 'id'> = {
        date: new Date().toISOString(),
        description,
        amount: Number(amount),
        busId: busId !== "" ? Number(busId) : undefined,
        type: tab,
      };

      dispatch(addExpense(newExpense));
      setOpen(false);

      resetForm();
      toast({
        title: "Success",
        description: "Expense added successfully.",
        variant: "default",
        duration: 1000
      });
    } catch (error: any) {
      console.error(error.message);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000
      });
    } finally {
      setIsLoading(false);  // End loading
    }
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
          <div className="flex space-x-4 my-4">
            <div
              className={`cursor-pointer px-4 py-2 rounded-lg text-center transition-all ${tab === "bus" ? "bg-gradient-btn text-white" : "bg-gray-200 text-gray-600"
                } hover:bg-gradient-btn hover:opacity-60 hover:text-white`}
              onClick={() => setTab("bus")}
            >
              Bus
            </div>
            <div
              className={`cursor-pointer px-4 py-2 rounded-lg text-center transition-all ${tab === "general" ? "bg-gradient-btn text-white" : "bg-gray-200 text-gray-600"
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
                  <SelectField
                    id="busNumber"
                    value={busId}
                    onChange={(value) => setBusId(Number(value))}
                    placeholder="Select Bus"
                    options={buses.map((bus) => ({
                      value: bus.id,
                      label: bus.busNumber,
                    }))}
                    label="Bus Number"
                    className="flex-col !space-x-0 gap-y-2 !items-start"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-gradient">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="amount" className="text-gradient">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    min={0}
                  />
                </div>
              </>
            )}

            {/* General Tab */}
            {tab === "general" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-gradient">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="amount" className="text-gradient">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    min={0}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
