import { deleteTicketPrice, updateTicketPrice } from '@/app/actions/pricing.action';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  TicketPriceRaw,
  TicketPriceRawEdit,
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
import { useToast } from '@/hooks/use-toast';

interface CellActionProps {
  // data: TicketPrice;
  data: TicketPriceDisplay;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {toast} = useToast();

  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteTicketPrice(data.id);
      dispatch(removeTicketRaw(data.id));
      toast({
        title:"Success",
        description:"Ticket Price Deleted successfully",
        variant:"default",
        duration:1000
      })
      setOpen(false);
    } catch (error:any) {
      console.error('Failed to delete route:', error);
      toast({
        title:"Error",
        description:error.message,
        variant:"destructive",
        duration:1000
      })
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async (updatedPrice: TicketPriceRawEdit) => {
    try {
      await updateTicketPrice(data.id, updatedPrice)
      dispatch(updateTicketRaw(updatedPrice));
      toast({
        title:"Success",
        description:"Ticket Price Updated successfully",
        variant:"default",
        duration:1000
      })
    } catch (error:any) {
      console.error(error.message);
      
      toast({
        title:"Error",
        description:error.message,
        variant:"destructive",
        duration:1000
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
        <EditPricingDialog ticket={data} onUpdate={handleUpdate} />
        <span className="my-2.5 cursor-pointer">
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
