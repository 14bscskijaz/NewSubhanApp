// components/SourceDestination.tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';  // Assuming RootState is defined here
import { allRoutes } from '@/lib/slices/route-slices';

interface SourceDestinationProps {
  routeId: number | null;
}

const SourceDestination = ({ routeId }: SourceDestinationProps) => {
  // Get routes from Redux state
  const routes = useSelector(allRoutes);

  // Ensure routeId is not null before finding the route
  const route = routes.find(route => route.id === routeId);

  return route ? `${route.source} - ${route.destination}` : 'N/A';
};

export default SourceDestination;
