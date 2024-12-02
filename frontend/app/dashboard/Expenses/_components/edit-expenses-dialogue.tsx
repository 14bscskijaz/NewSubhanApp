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
import { Expense } from '@/lib/slices/expenses-slices';
import { Pen } from 'lucide-react';
import { useEffect, useState } from 'react';

type EditPricingDialogProps = {
  expense: Expense;
  onUpdate: (updated: Expense) => void;
};

export default function EditPricingDialog({
  expense,
  onUpdate
}: EditPricingDialogProps) {
  const [formData, setFormData] = useState({
    description: expense.description,
    amount: expense.amount
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFormData({
      description: expense.description,
      amount: expense.amount
    });
  }, [expense]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [id]: id === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

   
    const updatedFormData: Expense = {
      ...expense, 
      description: formData.description,
      amount: formData.amount 
    };

    onUpdate(updatedFormData); // Pass the updated expense data
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="my-2.5 mr-2 cursor-pointer hover:text-green-500">
          <Pen className="h-4 w-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar max-h-[570px] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the details of the expense and click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount || ''}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
