import { searchParamsCache } from '@/lib/searchparams';
import React from 'react';
import DriverReportPage from './_components/driver-report-page';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata = {
  title: 'Dashboard : Driver Report'
};

export default async function Page({ searchParams }: PageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(await searchParams);

  return <DriverReportPage />;
}
