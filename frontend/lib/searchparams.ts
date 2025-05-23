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
  pageSize: parseAsInteger.withDefault(10),
  status: parseAsString,
  q: parseAsString.withDefault(''),
  gender: parseAsString,
  busNumber: parseAsString,
  busOwner: parseAsString,
  route: parseAsString,
  categories: parseAsString,
  date: parseAsString,
  dateRange: parseAsString,
  driver: parseAsString,
  busBrand: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
