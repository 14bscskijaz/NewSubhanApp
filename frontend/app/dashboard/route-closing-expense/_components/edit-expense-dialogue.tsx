import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
  SelectValue
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
  onUpdate
}: EditClosingExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...closingExpense
  });

  const routes = useSelector<RootState, Route[]>(allRoutes);
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);

  // Filter routes that exist in ticketsRaw
  const filteredRoutes = routes.filter((route) =>
    ticketsRaw.some((ticket) => ticket.routeId === route.id)
  );

  useEffect(() => {
    setFormData({
      ...closingExpense
    });
  }, [closingExpense]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRouteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, RouteId: parseInt(value) }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate(formData); // Call onUpdate with updated ClosingExpense data
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
              <Label htmlFor="DriverCommission" className="text-gradient">
                Driver Commission
              </Label>
              <Input
                id="DriverCommission"
                type="number"
                value={formData.driverCommission || ''}
                onChange={handleInputChange}
                placeholder="Enter driver commission"
              />
            </div>
            {/* COil Expense */}
            <div className="grid gap-2">
              <Label htmlFor="COilExpense" className="text-gradient">
                COil Expense
              </Label>
              <Input
                id="COilExpense"
                type="number"
                value={formData.coilExpense || ''}
                onChange={handleInputChange}
                placeholder="Enter COil Expense"
              />
            </div>
            {/* Toll Tax */}
            <div className="grid gap-2">
              <Label htmlFor="TollTax" className="text-gradient">
                Toll Tax
              </Label>
              <Input
                id="TollTax"
                type="number"
                value={formData.tollTax || ''}
                onChange={handleInputChange}
                placeholder="Enter toll tax"
              />
            </div>
            {/* Half Safai */}
            <div className="grid gap-2">
              <Label htmlFor="HalfSafai" className="text-gradient">
                Half Safai
              </Label>
              <Input
                id="HalfSafai"
                type="number"
                value={formData.halfSafai || ''}
                onChange={handleInputChange}
                placeholder="Enter half safai"
              />
            </div>
            {/* Full Safai */}
            <div className="grid gap-2">
              <Label htmlFor="FullSafai" className="text-gradient">
                Full Safai
              </Label>
              <Input
                id="FullSafai"
                type="number"
                value={formData.fullSafai || ''}
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
                value={formData.refreshmentRate || ''}
                onChange={handleInputChange}
                placeholder="Enter refreshment rate"
              />
            </div>
            {/* DC Parchi */}
            <div className="grid gap-2">
              <Label htmlFor="DcParchi" className="text-gradient">
                DC Parchi
              </Label>
              <Input
                id="DcParchi"
                type="number"
                value={formData.dcParchi || ''}
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
                value={formData.alliedMorde || ''}
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
