'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NewTripDialog from './new-trip-dialogue';
import TripTable from './trip-tables';
import { Trip, allTrips } from '@/lib/slices/fixed-trip-expense';

type TTripListingPage = {};

export default function TripListingPage({}: TTripListingPage) {
  const trips = useSelector<RootState, Trip[]>(allTrips);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [pageLimit, setPageLimit] = useState(10);

  useEffect(() => {
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const countParam = searchParams.get('count') || '';
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSource(countParam);
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  const filteredTrip = trips.filter((trip) => {
    const matchesSearch = search
      ? trip.routeCommission.toString().includes(search.toLowerCase()) ||
        trip.rewardCommission.toString().includes(search.toLowerCase()) ||
        trip.steward.toString().includes(search.toLowerCase()) ||
        trip.counter.toString().includes(search.toLowerCase()) ||
        trip.dcParchi.toString().includes(search.toLowerCase()) ||
        trip.refreshment.toString().includes(search.toLowerCase())
      : true;

    const matchesCount = source
      ? trip.routeCommission.toString() === source.toLowerCase() ||
        trip.rewardCommission.toString() === source.toLowerCase() ||
        trip.steward.toString() === source.toLowerCase() ||
        trip.counter.toString() === source.toLowerCase() ||
        trip.dcParchi.toString() === source.toLowerCase() ||
        trip.refreshment.toString() === source.toLowerCase()
      : true;

    return matchesSearch && matchesCount;
  });

  const totalTripExpense = filteredTrip.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = filteredTrip.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Trip Expense (${totalTripExpense})`}
            description=""
          />
          <NewTripDialog />
        </div>
        <Separator />
        <TripTable data={paginatedTrips} totalData={totalTripExpense} />
      </div>
    </PageContainer>
  );
}
