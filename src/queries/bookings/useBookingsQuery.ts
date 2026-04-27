import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingsResponseV2, BookingsListResponseV2 } from 'api/gen'
import { convertBookingsResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { BookingsStatusValue } from 'features/bookings/types'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

// Arbitrary. Make sure the cache is invalidated after each booking
const STALE_TIME_BOOKINGS = 5 * 60 * 1000

export const useBookingsV2Query = <TData = BookingsResponseV2>(
  enabledQuery: boolean,
  select?: (data: BookingsResponseV2) => TData
) =>
  useQuery<BookingsResponseV2, Error, TData>({
    queryKey: [QueryKeys.BOOKINGSV2],
    queryFn: () => api.getNativeV2Bookings(),
    select,
    enabled: enabledQuery,
    staleTime: STALE_TIME_BOOKINGS,
    meta: { persist: true },
  })

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
  status: BookingsStatusValue,
  enabled = true
) =>
  useBookingsV2Query(enabled, (data) =>
    select(convertBookingsResponseV2DatesToTimezone(data), status)
  )
