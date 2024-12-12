import { deleteBus, updateBuses } from '@/app/actions/bus.action';
import { AlertModal } from '@/components/modal/alert-modal';
import { Buses, removeBus, updateBus } from '@/lib/slices/bus-slices';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditBusDialog from '../edit-bus-dialogue';
import { useToast } from '@/hooks/use-toast';

interface CellActionProps {
  data: Buses;
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
      await deleteBus(data.id)
      dispatch(removeBus(data.id));
      toast({
        title: "Success",
        description: "Bus Deleted successfully",
        variant: "default",
        duration: 1000
      })
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to delete Bus:", error);
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

  const handleUpdate = async (updatedBus: Buses, id: number) => {
    try {
      await updateBuses(id, updatedBus)
      toast({
        title: "Success",
        description: "Bus Updated successfully",
        variant: "default",
        duration: 1000
      })
      dispatch(updateBus(updatedBus));
    } catch (error: any) {
      console.error("Failed to Update bus:", error);
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
        <EditBusDialog bus={data} onUpdate={handleUpdate} />
        <span className='my-2.5 cursor-pointer'>
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
