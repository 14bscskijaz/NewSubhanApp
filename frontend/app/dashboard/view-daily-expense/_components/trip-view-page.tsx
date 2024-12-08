import { ScrollArea } from '@/components/ui/scroll-area';
import TripForm from './trip-form';

export default function TripViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <TripForm />
      </div>
    </ScrollArea>
  );
}
