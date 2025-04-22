import { searchParamsCache, serialize } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/parsers';
import React from 'react';
import TripListingPage from './_components/trip-listing-page';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : View Bus Closing Vouchers'
};

export default async function Page({ searchParams }: pageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  return <TripListingPage />;
}
