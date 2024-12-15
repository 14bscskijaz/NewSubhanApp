'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TripTable from './trip-tables';
import { RootState } from '@/lib/store';
import { BusReport, allBusReports } from '@/lib/slices/Report/bus-report-slice';


export default function BusReportPage() {
  const busReports = useSelector<RootState, BusReport[]>(allBusReports);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [pageLimit, setPageLimit] = useState(5);
  const dispatch = useDispatch();
  const { toast } = useToast();


  useEffect(() => {
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const countParam = searchParams.get('count') || '';
    const limitParam = searchParams.get('limit') || '5';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSource(countParam);
    setPageLimit(Number(limitParam));
  }, [searchParams, dispatch]);


  const totalBusReport = busReports.length ;

  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTrips = busReports.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div>
          
        </div>
        <div className="flex items-start justify-between">
          <Heading
            title={`Bus Report (${totalBusReport})`}
            description=""
          />

          {/* <NewTripDialog /> */}
        </div>
        <Separator />
        <TripTable data={paginatedTrips} totalData={totalBusReport} />
      </div>
    </PageContainer>
  );
}
