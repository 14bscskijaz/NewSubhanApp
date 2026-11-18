import { searchParamsCache } from '@/lib/searchparams';
import React from 'react';
import ExpenseListingPage from './_components/expense-listing-page';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata = {
  title: 'Dashboard : Route Closing Expense'
};

export default async function Page({ searchParams }: PageProps) {
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(await searchParams);

  return <ExpenseListingPage />;
}
