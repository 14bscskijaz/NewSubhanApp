// components/SourceDestination.tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store'; // Assuming RootState is defined here
import { allRoutes } from '@/lib/slices/route-slices';

interface SourceDestinationProps {
  routeId: number | null;
  sourceStation: string;
  destinationStation: string;
}

const SourceDestination = ({
  routeId,
  sourceStation,
  destinationStation
}: SourceDestinationProps) => {
  // Get routes from Redux state
  const routes = useSelector(allRoutes);

  // Ensure routeId is not null before finding the route
  const route = routes.find(
    (route) =>
      `${route.sourceStation} - ${route.destinationStation}` ===
      `${sourceStation} - ${destinationStation}`
  );

  return route ? `${route.source} - ${route.destination}` : 'N/A';
};

export default SourceDestination;
