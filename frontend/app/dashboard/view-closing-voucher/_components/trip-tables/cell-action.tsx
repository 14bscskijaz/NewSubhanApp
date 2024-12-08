import { deleteFixedTripExpense, updateFixedTripExpenses } from '@/app/actions/FixedTripExpense.action';
import { AlertModal } from '@/components/modal/alert-modal';
import { FixedTripExpense, removeFixedTripExpense, updateFixedTripExpense } from '@/lib/slices/fixed-trip-expense';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditTripDialog from '../edit-trip-dialogue';

interface CellActionProps {
  data: FixedTripExpense;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onConfirm = async () => {
    setLoading(true);
    try {
      // await deleteFixedTripExpense(data.id);
      dispatch(removeFixedTripExpense(data.id));
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedTrip: FixedTripExpense) => {
    // await updateFixedTripExpenses(data.id, updatedTrip)
    dispatch(updateFixedTripExpense(updatedTrip));
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
        <EditTripDialog trip={data} onUpdate={handleUpdate} />
        <span className="my-2.5 cursor-pointer">
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
