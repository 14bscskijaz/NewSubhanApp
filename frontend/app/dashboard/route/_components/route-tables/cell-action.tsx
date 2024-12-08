import { deleteRoute, updatedRoutes } from '@/app/actions/route.action';
import { AlertModal } from '@/components/modal/alert-modal';
import { Route, removeRoute, updateRoute } from '@/lib/slices/route-slices';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditRouteDialog from '../edit-route-dialogue';

interface CellActionProps {
  data: Route;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const onConfirm = async () => {
    setLoading(true);
    try {
      // await deleteRoute(data.id)
      dispatch(removeRoute(data.id));
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete route:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async(updatedRoute: Route) => {
    // await updatedRoutes(data.id,updatedRoute)
    dispatch(updateRoute(updatedRoute));
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
        <EditRouteDialog route={data} onUpdate={handleUpdate} />
        <span className='my-2.5 cursor-pointer'>
        <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
