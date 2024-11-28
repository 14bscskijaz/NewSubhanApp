import { ScrollArea } from '@/components/ui/scroll-area';
import TripForm from './expense-form';

export default function ExpenseViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <TripForm />
      </div>
    </ScrollArea>
  );
}
