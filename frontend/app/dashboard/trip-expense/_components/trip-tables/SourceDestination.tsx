// components/SourceDestination.tsx
import { allRoutes } from '@/lib/slices/route-slices';
import { useSelector } from 'react-redux';

interface SourceDestinationProps {
  routeId: number | null;
}

const SourceDestination = ({ routeId }: SourceDestinationProps) => {
  // Get routes from Redux state
  const routes = useSelector(allRoutes);

  // Ensure routeId is not null before finding the route
  const route = routes.find(route => route.id === routeId);

  return route ? `${route.sourceCity} - ${route.destinationCity}` : 'N/A';
};

export default SourceDestination;
