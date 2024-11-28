import { ScrollArea } from '@/components/ui/scroll-area';
import RouteForm from './trip-info-form';

export default function RouteViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <RouteForm />
      </div>
    </ScrollArea>
  );
}
