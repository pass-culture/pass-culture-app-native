import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingsResponseV2, BookingsListResponseV2 } from 'api/gen'
import { convertBookingsResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { BookingsStatusValue } from 'features/bookings/types'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { CustomQueryOptions } from 'libs/react-query/types'

// Arbitrary. Make sure the cache is invalidated after each booking
const STALE_TIME_BOOKINGS = 5 * 60 * 1000

const GC_TIME_TWENTY_FOUR_DAYS = 1000 * 60 * 60 * 24 * 24

export const bookingsV2QueryOptions = () => ({
  queryKey: [QueryKeys.BOOKINGSV2],
  queryFn: () => api.getNativeV2Bookings(),
  staleTime: STALE_TIME_BOOKINGS,
  gcTime: GC_TIME_TWENTY_FOUR_DAYS,
  meta: { persist: true, private: true },
})

export const useBookingsV2Query = <TSelect = BookingsResponseV2>(
  options?: CustomQueryOptions<BookingsResponseV2, TSelect>
) => {
  return useQuery({ ...options, ...bookingsV2QueryOptions() })
}

export const prefetchBookingsV2Query = () => queryClient.prefetchQuery(bookingsV2QueryOptions())

export const useBookingsByStatusQuery = <TSelect = BookingsListResponseV2>(
  status: 'ongoing' | 'ended',
  options?: CustomQueryOptions<BookingsListResponseV2, TSelect>
) =>
  useQuery({
    queryKey: [QueryKeys.BOOKINGSLIST, status],
    queryFn: () => api.getNativeV2Bookingsstatus(status),
    ...options,
  })

export const useBookingsV2WithConvertedTimezoneQuery = <TSelect = BookingsListResponseV2>(
  select: (data: BookingsResponseV2, status: BookingsStatusValue) => TSelect,
  status: BookingsStatusValue
) =>
  useBookingsV2Query({
    select: (data) => select(convertBookingsResponseV2DatesToTimezone(data), status),
  })
