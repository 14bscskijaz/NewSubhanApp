"use client";
import { getAllBuses } from '@/app/actions/bus.action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Buses, allBuses, setBus } from '@/lib/slices/bus-slices';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BusTable from './bus-tables';
import NewEmployeeDialog from './new-bus-dialogue';
import { useToast } from '@/hooks/use-toast';

type TBusListingPage = {};

export default function BusListingPage({ }: TBusListingPage) {
  const buses = useSelector<RootState, Buses[]>(allBuses);
  const searchParams = useSearchParams(); // Use the hook to access search params
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // Change gender to status
  const [pageLimit, setPageLimit] = useState(10);
  const {toast} = useToast();

  const dispatch = useDispatch();

  const fetchEmoployee = async () => {
    try {
      const allBusesData = await getAllBuses();
      dispatch(setBus(allBusesData))
    } catch (error:any) {
      toast({
        title:"Error",
        description:error.message,
        variant:"destructive",
        duration:1000
      })
    }
  }

  useEffect(() => {
    fetchEmoployee()
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const statusParam = searchParams.get('status') || '';
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setStatus(statusParam);
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  const filteredBuses = buses.filter(buse => {
    const matchesSearch =
      search ?
        buse.busOwner.toLowerCase().includes(search.toLowerCase()) ||
        buse.busBrand.toLowerCase().includes(search.toLowerCase()) ||
        buse.busStatus.toLowerCase().includes(search.toLowerCase()) ||
        buse.busType.toLowerCase().includes(search.toLowerCase()) ||
        buse.description.toLowerCase().includes(search.toLowerCase()) ||
        buse.busNumber.toLowerCase().includes(search.toLowerCase()) :
        true;

    const matchesStatus =
      status ?
        buse.busStatus.toLowerCase() === status.toLowerCase() :
        true;

    return matchesSearch && matchesStatus; 
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
