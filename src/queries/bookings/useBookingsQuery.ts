import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { BookingsResponse, BookingsResponseV2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { usePersistQuery } from 'libs/react-query/usePersistQuery'

// Arbitrary. Make sure the cache is invalidated after each booking
const STALE_TIME_BOOKINGS = 5 * 60 * 1000

export const useBookingsQueryV1 = (options = {}) => {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()
  return usePersistQuery<BookingsResponse>([QueryKeys.BOOKINGS], () => api.getNativeV1Bookings(), {
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
  })
