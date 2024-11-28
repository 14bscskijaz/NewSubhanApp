"use client";
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Route, allRoutes } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NewRouteDialog from './new-route-dialogue';
import RouteTable from './route-tables';

type TRouteListingPage = {};

export default function RouteListingPage({}: TRouteListingPage) {
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const searchParams = useSearchParams(); 
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState(''); 
  const [pageLimit, setPageLimit] = useState(10);

  useEffect(() => {
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const sourceParam = searchParams.get('source') || '';
    const limitParam = searchParams.get('limit') || '10';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSource(sourceParam); // Set status instead of gender
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  const filteredRoutes = routes.filter(route => {
    const matchesSearch =
      search ?
        route.destination.toLowerCase().includes(search.toLowerCase()) ||
        route.source.toLowerCase().includes(search.toLowerCase())  :
        true;

    const matchesStatus =
      source ?
        route.source.toLowerCase() === source.toLowerCase() : 
        true;

    return matchesSearch && matchesStatus; // Combine both filters
  });

  const totalUsers = filteredRoutes.length;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedRoutes = filteredRoutes.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Route (${totalUsers})`}
            description=""
          />
          <NewRouteDialog />
        </div>
        <Separator />
        <RouteTable data={paginatedRoutes} totalData={totalUsers} />
      </div>
    </PageContainer>
  );
}
