'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { ClosingExpense, addClosingExpense, setClosingExpense } from '@/lib/slices/fixed-closing-expense-slice';
import { RootState } from '@/lib/store';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TicketPriceRaw, allTicketsRaw } from '@/lib/slices/pricing-slices';
import { createFixedBusClosingExpense, getAllFixedBusClosingExpenses } from '@/app/actions/FixedClosingExpense.action';

export default function NewExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [routeId, setRouteId] = useState<number | null>(null);
  const [driverCommission, setDriverCommission] = useState<number | ''>('');
  const [cOilExpense, setCOilExpense] = useState<number | ''>('');
  const [tollTax, setTollTax] = useState<number | ''>('');
  const [halfSafai, setHalfSafai] = useState<number | ''>('');
  const [fullSafai, setFullSafai] = useState<number | ''>('');
  const [refreshmentRate, setRefreshmentRate] = useState<number | ''>('');
  const [dcParchi, setDcParchi] = useState<number | ''>('');
  const [alliedMorde, setAlliedMorde] = useState<number | ''>('');

  const dispatch = useDispatch();

  const routes = useSelector<RootState, Route[]>(allRoutes);
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);

  // Filter routes that exist in ticketsRaw
  const filteredRoutes = routes.filter((route) =>
    ticketsRaw.some((ticket) => ticket.routeId === route.id)
  );

  const handleRouteChange = (selectedRouteId: string) => {
    setRouteId(Number(selectedRouteId));
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if routeId is valid before submitting
    if (routeId === null || routeId === 0) {
      alert('Please select a valid route.');
      return;
    }

    const newExpense:Omit<ClosingExpense,"id"> = {
      routeId: Number(routeId)??0,
      driverCommission: Number(driverCommission),
      cOilExpense: Number(cOilExpense),
      tollTax: Number(tollTax),
      halfSafai: Number(halfSafai),
      fullSafai: Number(fullSafai),
      refreshmentRate: Number(refreshmentRate),
      dcPerchi: Number(dcParchi),
      alliedMorde: Number(alliedMorde)
    };

    await createFixedBusClosingExpense(newExpense)
    const closingExpenses = await getAllFixedBusClosingExpenses();
    dispatch(setClosingExpense(closingExpenses))
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setRouteId(null);
    setDriverCommission('');
    setCOilExpense('');
    setTollTax('');
    setHalfSafai('');
    setFullSafai('');
    setRefreshmentRate('');
    setDcParchi('');
    setAlliedMorde('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Closing Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-[600px] overflow-y-auto sm:max-w-[900px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add New <span className="text-gradient">Closing Expense</span>
            </DialogTitle>
            <DialogDescription>
              Enter the details of the new Closing Expense here. Click save when
              you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-12 py-6 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="route" className="text-gradient">
                Route
              </Label>
              <Select onValueChange={handleRouteChange}>
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
            <div className="grid gap-2">
              <Label htmlFor="driverCommission" className="text-gradient">
                Driver Commission
              </Label>
              <Input
                id="driverCommission"
                type="number"
                placeholder="Enter Driver Commission"
                value={driverCommission}
                onChange={(e) =>
                  setDriverCommission(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cOilExpense" className="text-gradient">
                C. Oil Expense
              </Label>
              <Input
                id="cOilExpense"
                type="number"
                placeholder="Enter C. Oil Expense"
                value={cOilExpense}
                onChange={(e) =>
                  setCOilExpense(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tollTax" className="text-gradient">
                Toll Tax
              </Label>
              <Input
                id="tollTax"
                type="number"
                placeholder="Enter Toll Tax"
                value={tollTax}
                onChange={(e) =>
                  setTollTax(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="halfSafai" className="text-gradient">
                Half Safai
              </Label>
              <Input
                id="halfSafai"
                type="number"
                placeholder="Enter Half Safai"
                value={halfSafai}
                onChange={(e) =>
                  setHalfSafai(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fullSafai" className="text-gradient">
                Full Safai
              </Label>
              <Input
                id="fullSafai"
                type="number"
                placeholder="Enter Full Safai"
                value={fullSafai}
                onChange={(e) =>
                  setFullSafai(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="refreshmentRate" className="text-gradient">
                Refreshment Rate
              </Label>
              <Input
                id="refreshmentRate"
                type="number"
                placeholder="Enter Refreshment Rate"
                value={refreshmentRate}
                onChange={(e) =>
                  setRefreshmentRate(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dcParchi" className="text-gradient">
                DC Parchi
              </Label>
              <Input
                id="dcParchi"
                type="number"
                placeholder="Enter DC Parchi"
                value={dcParchi}
                onChange={(e) =>
                  setDcParchi(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alliedMorde" className="text-gradient">
                Allied Morde
              </Label>
              <Input
                id="alliedMorde"
                type="number"
                placeholder="Enter Allied Morde"
                value={alliedMorde}
                onChange={(e) =>
                  setAlliedMorde(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
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
