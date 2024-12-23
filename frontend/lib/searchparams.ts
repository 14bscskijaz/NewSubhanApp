import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsIsoDateTime,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  status:parseAsString,
  q: parseAsString,
  gender: parseAsString,
  busNumber: parseAsString,
  busOwner: parseAsString,
  route: parseAsString,
  categories: parseAsString,
  date: parseAsString,
  dateRange: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
