import { deleteEmployee, updateEmployeeAPI } from '@/app/actions/employee.action';
import { AlertModal } from '@/components/modal/alert-modal';
import { Employee, removeEmployee, updateEmployee } from '@/lib/slices/employe-slices'; // Import your delete and update actions
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import EditEmployeeDialog from '../edit-employee-dialogue';
import { useToast } from '@/hooks/use-toast';

interface CellActionProps {
  data: Employee;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const onConfirm = async () => {
    setLoading(true);
    try {
      data && data?.id && await deleteEmployee(Number(data.id))
      dispatch(removeEmployee(data.id));
      toast({
        title: "Success",
        description: "Employee Deleted successfully",
        variant: "default",
        duration: 1000
      })
      setOpen(false);
    } catch (error: any) {
      console.error("Failed to delete employee:", error);
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

  const handleUpdate = async (updatedEmployee: Employee) => {
    try {
      await updateEmployeeAPI(Number(data.id), updatedEmployee)
      dispatch(updateEmployee(updatedEmployee));
      toast({
        title: "Success",
        description: "Employee Updated successfully",
        variant: "default",
        duration: 1000
      })
    } catch (error: any) {
      console.error("Failed to Update employee:", error);
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
        <EditEmployeeDialog employee={data} onUpdate={handleUpdate} />
        <span className='my-2.5 cursor-pointer'>
          <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
        </span>
      </div>
    </>
  );
};
