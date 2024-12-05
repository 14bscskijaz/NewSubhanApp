import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClosingExpense } from '@/lib/slices/fixed-closing-expense-slice'; // Import ClosingExpense type
import { Pen } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';

type EditClosingExpenseDialogProps = {
  closingExpense: ClosingExpense;
  onUpdate: (updatedExpense: ClosingExpense) => void;
};

export default function EditClosingExpenseDialog({
  closingExpense,
  onUpdate,
}: EditClosingExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ ...closingExpense });

  const routes = useSelector<RootState, Route[]>(allRoutes);
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);

  // Filter routes that exist in ticketsRaw
  const filteredRoutes = routes.filter((route) =>
    ticketsRaw.some((ticket) => ticket.routeId === route.id)
  ); 
  useEffect(() => {
    setFormData({ ...closingExpense });

    
  }, [closingExpense]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value === '' ? 0 : parseFloat(value), // Convert empty strings to 0
    }));
  };

  const handleRouteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, routeId: parseInt(value) }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate(formData); 
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="my-2.5 mr-2 cursor-pointer">
          <Pen className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-[570px] overflow-y-auto sm:max-w-[940px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Closing Expense</DialogTitle>
            <DialogDescription>
              Update the details of the closing expense and click save when you
              are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-10 py-4 md:grid-cols-2">
            {/* Route Dropdown */}
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="route" className="text-gradient">
                Route
              </Label>
              <Select
                onValueChange={handleRouteChange}
                value={formData.routeId?.toString() || ''}
              >
                <SelectTrigger id="route">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRoutes.map((route) => (
                    <SelectItem key={route.id} value={`${route.id}`}>
                      {`${route.sourceCity} (${route.sourceAdda})`} -{' '}
                      {`${route.destinationCity} (${route.destinationAdda})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Driver Commission */}
            <div className="grid gap-2">
              <Label htmlFor="driverCommission" className="text-gradient">
                Driver Commission
              </Label>
              <Input
                id="driverCommission"
                type="number"
                value={formData.driverCommission.toString()}
                onChange={handleInputChange}
                placeholder="Enter driver commission"
              />
            </div>
            {/* COil Expense */}
            <div className="grid gap-2">
              <Label htmlFor="cOilExpense" className="text-gradient">
                COil Expense
              </Label>
              <Input
                id="cOilExpense"
                type="number"
                value={formData.cOilExpense.toString()}
                onChange={handleInputChange}
                placeholder="Enter COil Expense"
              />
            </div>
            {/* Toll Tax */}
            <div className="grid gap-2">
              <Label htmlFor="tollTax" className="text-gradient">
                Toll Tax
              </Label>
              <Input
                id="tollTax"
                type="number"
                value={formData.tollTax.toString()}
                onChange={handleInputChange}
                placeholder="Enter toll tax"
              />
            </div>
            {/* Half Safai */}
            <div className="grid gap-2">
              <Label htmlFor="halfSafai" className="text-gradient">
                Half Safai
              </Label>
              <Input
                id="halfSafai"
                type="number"
                value={formData.halfSafai.toString()}
                onChange={handleInputChange}
                placeholder="Enter half safai"
              />
            </div>
            {/* Full Safai */}
            <div className="grid gap-2">
              <Label htmlFor="fullSafai" className="text-gradient">
                Full Safai
              </Label>
              <Input
                id="fullSafai"
                type="number"
                value={formData.fullSafai.toString()}
                onChange={handleInputChange}
                placeholder="Enter full safai"
              />
            </div>
            {/* Refreshment Rate */}
            <div className="grid gap-2">
              <Label htmlFor="refreshmentRate" className="text-gradient">
                Refreshment Rate
              </Label>
              <Input
                id="refreshmentRate"
                type="number"
                value={formData.refreshmentRate.toString()}
                onChange={handleInputChange}
                placeholder="Enter refreshment rate"
              />
            </div>
            {/* DC Parchi */}
            <div className="grid gap-2">
              <Label htmlFor="dcPerchi" className="text-gradient">
                DC Parchi
              </Label>
              <Input
                id="dcPerchi"
                type="number"
                value={formData.dcPerchi.toString()}
                onChange={handleInputChange}
                placeholder="Enter DC parchis"
              />
            </div>
            {/* Allied Morde */}
            <div className="grid gap-2">
              <Label htmlFor="alliedMorde" className="text-gradient">
                Allied Morde
              </Label>
              <Input
                id="alliedMorde"
                type="number"
                value={formData.alliedMorde.toString()}
                onChange={handleInputChange}
                placeholder="Enter allied morde"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
