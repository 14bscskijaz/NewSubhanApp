import { deleteFixedBusClosingExpense, updateFixedBusClosingExpense } from '@/app/actions/FixedClosingExpense.action';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  ClosingExpense,
  removeClosingExpense,
  updateClosingExpense
} from '@/lib/slices/fixed-closing-expense-slice';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditClosingExpenseDialog from '../edit-expense-dialogue';
import { useToast } from '@/hooks/use-toast';

interface CellActionProps {
  data: ClosingExpense;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteFixedBusClosingExpense(data.id);
      dispatch(removeClosingExpense(data.id));
      toast({
        title: "Success",
        description: "Fixed Route Close Expense Deleted successfully",
        variant: "default",
        duration: 1000
      })
      setOpen(false);
    } catch (error: any) {
      console.error('Failed to delete closing expense:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000
      })
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedClosingExpense: ClosingExpense) => {
    try {
      await updateFixedBusClosingExpense(data.id, updatedClosingExpense);
      dispatch(updateClosingExpense(updatedClosingExpense));
      toast({
        title: "Success",
        description: "Fixed Route Close Expense Updated successfully",
        variant: "default",
        duration: 1000
      })
    } catch (error: any) {
      console.error(error.message);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 1000
      })
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className="flex gap-2">
        <EditClosingExpenseDialog
          closingExpense={data}
          onUpdate={handleUpdate}
        />
        <span className="my-2.5 cursor-pointer">
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
