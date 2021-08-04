import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { BookingReponse, BookingsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

// Arbitrary. Make sure the cache is invalidated after each booking
const STALE_TIME_BOOKINGS = 5 * 60 * 1000

export function useBookings() {
  return useQuery<BookingsResponse>(QueryKeys.BOOKINGS, () => api.getnativev1bookings(), {
    staleTime: STALE_TIME_BOOKINGS,
  })
}

export function useOngoingOrEndedBooking(id: number): BookingReponse | undefined {
  const { data: bookings } = useBookings()
  return useMemo(() => {
    if (!bookings) {
      return undefined
    }
    const onGoingBooking = bookings.ongoing_bookings.find((item) => item.id === id)
    const endedBooking = bookings.ended_bookings.find((item) => item.id === id)
    return onGoingBooking || endedBooking
  }, [bookings, id])
}
