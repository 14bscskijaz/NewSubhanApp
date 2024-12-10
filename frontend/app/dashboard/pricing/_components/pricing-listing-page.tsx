'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { TicketPriceRaw, allTicketsRaw, setTicketRaw } from '@/lib/slices/pricing-slices';
import { Route, allRoutes, setRoute } from '@/lib/slices/route-slices';
import { RootState } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NewPricingDialog from './new-pricing-dialogue';
import RouteTable from './route-tables';
import { getAllTicketPrices } from '@/app/actions/pricing.action';
import { getAllRoutes } from '@/app/actions/route.action';

type TPricingListingPage = {};

export type TicketPriceDisplay = {
  id: number;
  source: string;
  sourceStation: string;
  destination: string;
  destinationStation: string;
  ticketPrice: number;
  routeId?: number;
  busType: string;
};

export default function PricingListingPage({ }: TPricingListingPage) {
  const ticketsRaw = useSelector<RootState, TicketPriceRaw[]>(allTicketsRaw);
  const routes = useSelector<RootState, Route[]>(allRoutes);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [pageLimit, setPageLimit] = useState(5);

  const dispatch = useDispatch();
  const fetchTicket = async () => {
    const routes = await getAllRoutes()
    const allTicketData = await getAllTicketPrices()
    // console.log(allTicketData, "allTicketData");
    dispatch(setTicketRaw(allTicketData))
    dispatch(setRoute(routes))

  }

  useEffect(() => {
    fetchTicket();
    const pageParam = searchParams.get('page') || '1';
    const searchParam = searchParams.get('q') || '';
    const sourceParam = searchParams.get('source') || '';
    const limitParam = searchParams.get('limit') || '5';

    setPage(Number(pageParam));
    setSearch(searchParam);
    setSource(sourceParam);
    setPageLimit(Number(limitParam));
  }, [searchParams]);

const uniqueTicketsRaw = ticketsRaw.filter(
  (ticket, index, self) =>
    index === self.findIndex(
      (t) =>
        t.id === ticket.id ||
        (t.routeId === ticket.routeId && t.busType === ticket.busType)
    )
);

// Map the unique tickets to display format
const displayTickets = uniqueTicketsRaw.map((ticket) => {
  const route = routes.find((route) => route.id === ticket.routeId);
  if (route) {
    return {
      id: ticket.id,
      source: route.sourceCity,
      sourceStation: route.sourceAdda,
      destination: route.destinationCity,
      destinationStation: route.destinationAdda,
      ticketPrice: ticket.ticketPrice,
      busType: ticket.busType,
      routeId: ticket.routeId,
    };
  } else {
    return {
      id: ticket.id,
      source: 'Unknown',
      sourceStation: 'Unknown',
      destination: 'Unknown',
      destinationStation: 'Unknown',
      ticketPrice: ticket.ticketPrice,
      busType: ticket.busType,
      routeId: ticket.routeId,
    };
  }
});


  // Filtering based on search parameters
  const filteredTickets = displayTickets.filter((ticket) => {
    const matchesSearch = search
      ? ticket.destination.toLowerCase().includes(search.toLowerCase()) ||
      ticket.source.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesStatus = source
      ? ticket.source.toLowerCase() === source.toLowerCase()
      : true;

    return matchesSearch && matchesStatus;
  });

  const totalTickets = filteredTickets.length;
  const startIndex = (page - 1) * pageLimit;
  const endIndex = startIndex + pageLimit;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Ticket Pricing (${totalTickets})`} description="" />
          <NewPricingDialog />
        </div>
        <Separator />
        <RouteTable data={paginatedTickets} totalData={totalTickets} />
      </div>
    </PageContainer>
  );
}
