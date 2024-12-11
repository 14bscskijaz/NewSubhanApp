import { Buses, allBuses } from '@/lib/slices/bus-slices';
import { RootState } from '@/lib/store';
import React from 'react';
import { useSelector } from 'react-redux';

type BusNumberProps = {
  busId: number;
};

const BusNumber: React.FC<BusNumberProps> = ({ busId }) => {
  const buses = useSelector<RootState, Buses[]>(allBuses);

  // Find the bus with the given busId
  const foundBus = buses.find((bus) => bus.id === busId);

  return (
    <div>
      {foundBus ? (
        <p>{foundBus.busNumber}</p>
      ) : (
        <p>N/A</p>
      )}
    </div>
  );
};

export default BusNumber;
