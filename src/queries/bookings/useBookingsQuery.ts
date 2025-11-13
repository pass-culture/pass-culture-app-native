import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingsResponseV2, BookingsListResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { convertBookingsResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsResponseV2DatesToTimezone'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'
import { usePersistQuery } from 'libs/react-query/usePersistQuery'

// Arbitrary. Make sure the cache is invalidated after each booking
const STALE_TIME_BOOKINGS = 5 * 60 * 1000

export const useBookingsQueryV1 = (options = {}) => {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()
  return usePersistQuery([QueryKeys.BOOKINGS], () => api.getNativeV1Bookings(), {
    enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable && isLoggedIn,
    staleTime: STALE_TIME_BOOKINGS,
    ...options,
  })
}

export const useBookingsQuery = <TData = BookingsResponseV2>(
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
  status: string,
  options?: CustomQueryOptions<BookingsListResponseV2, TSelect>
) =>
  useQuery({
    queryKey: [QueryKeys.BOOKINGSLIST, status],
    queryFn: () => api.getNativeV2Bookingsstatus(status),
    ...options,
  })

export const useBookingsV2WithConvertedTimezoneQuery = (enabled: boolean) =>
  useBookingsQuery(enabled, (data) => convertBookingsResponseV2DatesToTimezone(data))
