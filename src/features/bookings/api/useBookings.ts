import { api } from 'api/api'
import { BookingsResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { usePersistQuery } from 'libs/react-query/usePersistQuery'

// Arbitrary. Make sure the cache is invalidated after each booking
const STALE_TIME_BOOKINGS = 5 * 60 * 1000

export function useBookings(options = {}) {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()
  return usePersistQuery<BookingsResponse>(QueryKeys.BOOKINGS, () => api.getnativev1bookings(), {
    enabled: !!netInfo.isConnected && !!netInfo.isInternetReachable && isLoggedIn,
    staleTime: STALE_TIME_BOOKINGS,
    ...options,
  })
}
