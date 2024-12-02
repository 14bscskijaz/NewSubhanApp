'use client';
import { allRoutes, Route } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';

interface SourceDestinationProps {
  routeId: string | undefined ;
}

const SourceDestination: React.FC<SourceDestinationProps> = ({ routeId }) => {
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const route = routes.find((route) => route.id === parseInt(routeId as string));
  
  const sourceStation = route?.sourceAdda ?? 'Unknown';
  const destinationStation = route?.destinationAdda ?? 'Unknown';

  return (
    <span>
      {sourceStation} - {destinationStation}
    </span>
  );
};

export default SourceDestination;
