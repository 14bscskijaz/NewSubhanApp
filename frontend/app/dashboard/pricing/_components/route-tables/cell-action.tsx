import { deleteTicketPrice, updateTicketPrice } from '@/app/actions/pricing.action';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  TicketPriceRaw,
  removeTicketRaw,
  updateTicketRaw
} from '@/lib/slices/pricing-slices';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditPricingDialog from '../edit-pricing-dialogue';
import { TicketPriceDisplay } from '../pricing-listing-page';

interface CellActionProps {
  // data: TicketPrice;
  data: TicketPriceDisplay;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteTicketPrice(data.id);
      dispatch(removeTicketRaw(data.id));
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete route:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async (updatedPrice: TicketPriceRaw) => {

    
    await updateTicketPrice(data.id, updatedPrice)
    dispatch(updateTicketRaw(updatedPrice));
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
        <EditPricingDialog ticket={data} onUpdate={handleUpdate} />
        <span className="my-2.5 cursor-pointer">
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
