'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { TripInformation } from '@/lib/slices/trip-information';
import { columns } from './columns';

export default function RouteTable({
  data,
  totalData
}: {
  data: TripInformation[];
  totalData: number;
}) {

  return (
    <div className="">
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
