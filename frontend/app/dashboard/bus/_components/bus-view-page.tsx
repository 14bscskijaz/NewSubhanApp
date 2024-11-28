import { ScrollArea } from '@/components/ui/scroll-area';
import BusesForm from './bus-form';

export default function BusesViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <BusesForm />
      </div>
    </ScrollArea>
  );
}
