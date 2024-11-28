// components/SourceDestination.tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';  // Assuming RootState is defined here
import { allRoutes } from '@/lib/slices/route-slices';

interface SourceDestinationProps {
  routeId: string | number;
}

const SourceDestination = ({ routeId }: SourceDestinationProps) => {
  // Convert routeId to number if it's a string
  const routeIdNumber = typeof routeId === 'string' ? parseInt(routeId) : routeId;

  // Get routes from Redux state
  const routes = useSelector(allRoutes);

  // Ensure routeId is valid before finding the route
  const route = routes.find(route => route.id === routeIdNumber);

  return route ? `${route.sourceStation} - ${route.destinationStation}` : 'N/A';
};

export default SourceDestination;
