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

interface CellActionProps {
  data: ClosingExpense;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onConfirm = async () => {
    setLoading(true);
    try {
      dispatch(removeClosingExpense(data.id));
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete closing expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedClosingExpense: ClosingExpense) => {
    dispatch(updateClosingExpense(updatedClosingExpense));
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
