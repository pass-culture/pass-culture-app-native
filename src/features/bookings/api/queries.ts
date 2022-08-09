import { UseQueryResult } from 'react-query'

import { api } from 'api/api'
import { BookingReponse, BookingsResponse } from 'api/gen'
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

export function useOngoingOrEndedBooking(id: number): UseQueryResult<BookingReponse | null> {
  return useBookings({
    select(bookings: BookingsResponse | null) {
      if (!bookings) {
        return null
      }
      const onGoingBooking = bookings.ongoing_bookings?.find(
        (item: BookingReponse) => item.id === id
      )
      const endedBooking = bookings.ended_bookings?.find((item: BookingReponse) => item.id === id)

      const selected = onGoingBooking || endedBooking
      if (!selected) {
        return null
      }
      return selected
    },
  }) as UseQueryResult<BookingReponse | null>
}

export function useEndedBookingFromOfferId(offerId: number): UseQueryResult<BookingReponse | null> {
  return useBookings({
    select(bookings: BookingsResponse | null) {
      if (!bookings) {
        return null
      }

      const selected = bookings.ended_bookings?.find(
        (item: BookingReponse) => item.stock.offer.id === offerId
      )

      if (!selected) {
        return null
      }
      return selected
    },
  }) as UseQueryResult<BookingReponse | null>
}
