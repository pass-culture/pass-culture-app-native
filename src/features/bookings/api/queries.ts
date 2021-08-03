import { useQuery } from 'react-query'

import { api } from 'api/api'
import { BookingReponse, BookingsResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

// Arbitrary. Make sure the cache is invalidated after each booking
const STALE_TIME_BOOKINGS = 5 * 60 * 1000

export function useBookings() {
  const { isLoggedIn } = useAuthContext()

  return useQuery<BookingsResponse>(QueryKeys.BOOKINGS, () => api.getnativev1bookings(), {
    staleTime: STALE_TIME_BOOKINGS,
    useErrorBoundary: isLoggedIn,
  })
}

export function useOngoingOrEndedBooking(id: number): BookingReponse | undefined {
  const { data: bookings } = useBookings()
  const onGoingBooking = bookings?.ongoing_bookings?.find((item) => item.id === id)
  const endedBooking = bookings?.ended_bookings?.find((item) => item.id === id)
  return onGoingBooking || endedBooking
}
