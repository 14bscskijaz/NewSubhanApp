"use client";
import { getAllRoutes } from '@/app/actions/route.action';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Route, allRoutes, setRoute } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewRouteDialog from './new-route-dialogue';
import RouteTable from './route-tables';

type TRouteListingPage = {};

export default function RouteListingPage({}: TRouteListingPage) {
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const searchParams = useSearchParams(); 
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState(''); 
  const [pageLimit, setPageLimit] = useState(5);
  const dispatch = useDispatch()

  // const fetchRoutes = async() =>{
  //   const getRoutes = await getAllRoutes()
  //   dispatch(setRoute(getRoutes));
  //   console.log(getRoutes,"getRoutes");
    
  // }


  useEffect(() => {
    // fetchRoutes()
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const sourceParam = searchParams.get('source') || '';
    const limitParam = searchParams.get('limit') || '5';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSource(sourceParam); 
    setPageLimit(Number(limitParam));
  }, [searchParams]);

  const filteredRoutes = routes.filter(route => {
    const matchesSearch =
      search ?
        route.destinationCity.toLowerCase().includes(search.toLowerCase()) ||
        route.sourceCity.toLowerCase().includes(search.toLowerCase())  :
        true;

    const matchesStatus =
      source ?
        route.sourceCity.toLowerCase() === source.toLowerCase() : 
        true;

    return matchesSearch && matchesStatus; 
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
