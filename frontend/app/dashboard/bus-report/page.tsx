import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import BusReportListingPage from './_components/bus-report-listing-page';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Bus Report'
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return <BusReportListingPage />;
}
