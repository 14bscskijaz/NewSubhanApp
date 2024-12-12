import { AlertModal } from '@/components/modal/alert-modal';
import {
  TripInformation,
  removeTripInformation,
  updateTripInformation
} from '@/lib/slices/trip-information';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditRouteDialog from '../edit-trip-info-dialogue';
import { deleteTrip } from '@/app/actions/trip.action';
import { useToast } from '@/hooks/use-toast';

interface CellActionProps {
  data: TripInformation;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {toast} = useToast();

  const onConfirm = async () => {
    setLoading(true);
    try {
      // await deleteTrip(data.id);
      dispatch(removeTripInformation(data.id));
      toast({
        title:"Success",
        description:"Trip Info Deleted successfully",
        variant:"default",
        duration:1000
      })
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async(updatedTripInformation: TripInformation) => {
    try {
      dispatch(updateTripInformation(updatedTripInformation));
      toast({
        title:"Success",
        description:"Trip Info Updated successfully",
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
        <EditRouteDialog tripInformation={data} onUpdate={handleUpdate} />
        <span className="my-2.5 cursor-pointer">
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
