import { AlertModal } from '@/components/modal/alert-modal';
import { Expense, removeExpense, updateExpense } from '@/lib/slices/expenses-slices';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditExpensesDialog from '../edit-expenses-dialogue';
import { deleteExpense } from '@/app/actions/expenses.action';

interface CellActionProps {
  // data: TicketPrice;
  data: Expense;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onConfirm = async () => {
    setLoading(true);
    try {
      if(data?.originalId){
        
        await deleteExpense(data.originalId);
        dispatch(removeExpense(data.id));
      }
      else{
        dispatch(removeExpense(data.id));
      }
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedExpenses: Expense) => {
    dispatch(updateExpense(updatedExpenses));
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
        <EditExpensesDialog expense={data} onUpdate={handleUpdate} />
        <span className="my-2.5 cursor-pointer hover:text-red-600">
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
