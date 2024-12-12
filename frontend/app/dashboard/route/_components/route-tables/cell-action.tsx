import { deleteRoute, updatedRoutes } from '@/app/actions/route.action';
import { AlertModal } from '@/components/modal/alert-modal';
import { Route, removeRoute, updateRoute } from '@/lib/slices/route-slices';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditRouteDialog from '../edit-route-dialogue';
import { useToast } from '@/hooks/use-toast';

interface CellActionProps {
  data: Route;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const onConfirm = async () => {
    setLoading(true);
    try {
      await deleteRoute(data.id)
      dispatch(removeRoute(data.id));
      toast({
        title: "Success",
        description: "Route Deleted successfully",
        variant: "default",
        duration: 1000
      })
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to delete route:", error);

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

  const handleUpdate = async (updatedRoute: Route) => {
    try {
      await updatedRoutes(data.id, updatedRoute)
      dispatch(updateRoute(updatedRoute));
      toast({
        title: "Success",
        description: "Route Updated successfully",
        variant: "default",
        duration: 1000
      })
    } catch (error: any) {
      console.error(error.message);

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
        <EditRouteDialog route={data} onUpdate={handleUpdate} />
        <span className='my-2.5 cursor-pointer'>
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
