import { searchParamsCache, serialize } from '@/lib/searchparams';
import React from 'react';
import TripListingPage from './_components/trip-listing-page';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata = {
  title: 'Dashboard : View Bus Closing Vouchers'
};

export default async function Page({ searchParams }: PageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  const resolvedSearchParams = await searchParams;
  searchParamsCache.parse(resolvedSearchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize(resolvedSearchParams);

  return <TripListingPage />;
}
