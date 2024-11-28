import { ScrollArea } from '@/components/ui/scroll-area';
import RouteForm from './pricing-form';

export default function PricingViewPage() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <RouteForm />
      </div>
    </ScrollArea>
  );
}
