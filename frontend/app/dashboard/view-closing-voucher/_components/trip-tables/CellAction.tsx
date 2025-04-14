import { deleteBusClosingVoucher } from '@/app/actions/BusClosingVoucher.action';
import { deleteExpense } from '@/app/actions/expenses.action';
import { AlertModal } from '@/components/modal/alert-modal';
import { BusClosingVoucher, removeBusClosingVoucher } from '@/lib/slices/bus-closing-voucher';
import { removeExpense } from '@/lib/slices/expenses-slices';
import { AppDispatch } from '@/lib/store';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

interface CellActionProps {
    // data: TicketPrice;
    data: BusClosingVoucher;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const onConfirm = async () => {
        setLoading(true);
        try {
            if (data?.id) {

                await deleteBusClosingVoucher(data.id);
                dispatch(removeBusClosingVoucher(data.id));
            }
            else {
                dispatch(removeBusClosingVoucher(data.id));
            }
            setOpen(false);
        } catch (error) {
            console.error('Failed to delete route:', error);
        } finally {
            setLoading(false);
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
                {/* <EditExpensesDialog expense={data} onUpdate={handleUpdate} /> */}
                <span className="my-2.5 cursor-pointer hover:text-red-600">
                    <Trash onClick={() => setOpen(true)} className="mr-2 h-4 w-4" />
                </span>
            </div>
        </>
    );
};
