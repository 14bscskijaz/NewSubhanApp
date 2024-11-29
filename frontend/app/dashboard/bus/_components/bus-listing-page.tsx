"use client";
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import BusTable from './bus-tables';
import NewEmployeeDialog from './new-bus-dialogue';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useEffect, useState } from 'react';
import { Employee, allEmployees } from '@/lib/slices/employe-slices';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { Buses, addBus, allBuses } from '@/lib/slices/bus-slices';
import { getAllBuses } from '@/app/actions/bus.action';

type TBusListingPage = {};

export default function BusListingPage({}: TBusListingPage) {
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const searchParams = useSearchParams(); // Use the hook to access search params
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // Change gender to status
  const [pageLimit, setPageLimit] = useState(10);

  const dispatch = useDispatch();

  const fetchEmoployee = async() =>{
      const allBusesData = await getAllBuses();
      console.log(allBusesData,"allBusData");
      
      // dispatch(addBus(allBusesData))
    }

  useEffect(() => {
    fetchEmoployee()
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const statusParam = searchParams.get('status') || ''; // Change from gender to status
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setStatus(statusParam); // Set status instead of gender
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  const filteredBuses = buses.filter(buse => {
    const matchesSearch =
      search ?
      buse.bus_owner.toLowerCase().includes(search.toLowerCase()) ||
      buse.bus_number.toLowerCase().includes(search.toLowerCase()) :
        true;

    const matchesStatus =
      status ?
        buse.bus_status.toLowerCase() === status.toLowerCase() : 
        true;

    return matchesSearch && matchesStatus; // Combine both filters
  });

  const totalBuses = filteredBuses.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedBuses = filteredBuses.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Bus (${totalBuses})`}
            description=""
          />
          <NewEmployeeDialog />
        </div>
        <Separator />
        <BusTable data={paginatedBuses} totalData={totalBuses} />
      </div>
    </PageContainer>
  );
}
