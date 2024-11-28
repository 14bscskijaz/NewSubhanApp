import { AlertModal } from '@/components/modal/alert-modal';
import {
  BusClosing,
  removeBusClosing,
  updateBusClosing
} from '@/lib/slices/bus-closing';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditRouteDialog from '../edit-trip-info-dialogue';
import {
  removeTripInformation,
  TripInformation,
  updateTripInformation
} from '@/lib/slices/trip-information';

interface CellActionProps {
  data: TripInformation;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onConfirm = async () => {
    setLoading(true);
    try {
      dispatch(removeTripInformation(data.id));
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedTripInformation: TripInformation) => {
    console.log(updatedTripInformation);
    dispatch(updateTripInformation(updatedTripInformation));
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
