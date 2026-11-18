import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  BusApiError,
  listBuses
} from '@/app/dashboard/bus-v2/_lib/bus-api.server';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' } as const;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Your session has expired. Please sign in again.' },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const buses = await listBuses();

    return NextResponse.json(buses, { headers: NO_STORE_HEADERS });
  } catch (error) {
    // eslint-disable-next-line no-console -- server-side observability required by the spec
    console.error(
      '[bus-v2] GET /api/buses failed',
      error instanceof BusApiError
        ? { kind: error.kind, status: error.status }
        : { kind: 'UNKNOWN' }
    );

    const status =
      error instanceof BusApiError && error.kind === 'CONFIG' ? 500 : 502;

    return NextResponse.json(
      { message: 'Unable to load buses.' },
      { status, headers: NO_STORE_HEADERS }
    );
  }
}
