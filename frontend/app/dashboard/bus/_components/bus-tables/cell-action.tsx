import { deleteBus, updateBuses } from '@/app/actions/bus.action';
import { AlertModal } from '@/components/modal/alert-modal';
import { Buses, removeBus, updateBus } from '@/lib/slices/bus-slices';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditBusDialog from '../edit-bus-dialogue';

interface CellActionProps {
  data: Buses;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteBus(data.id)
      dispatch(removeBus(data.id));
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async(updatedBus: Buses,id:number) => {
    await updateBuses(id,updatedBus)
    dispatch(updateBus(updatedBus));
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
        <EditBusDialog bus={data} onUpdate={handleUpdate} />
        <span className='my-2.5 cursor-pointer'>
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
