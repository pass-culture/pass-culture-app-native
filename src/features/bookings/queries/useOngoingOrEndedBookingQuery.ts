import { UseQueryResult } from '@tanstack/react-query'

import { BookingReponse, BookingsResponse } from 'api/gen'
import { useBookingsQuery } from 'queries/bookings/useBookingsQuery'

export function useOngoingOrEndedBookingQuery(id: number): UseQueryResult<BookingReponse | null> {
  return useBookingsQuery({
    select(bookings: BookingsResponse | null) {
      if (!bookings) {
        return null
      }
      const onGoingBooking = bookings.ongoing_bookings?.find(
        (item: BookingReponse) => item.id === id
      )
      const endedBooking = bookings.ended_bookings?.find((item: BookingReponse) => item.id === id)

      const selected = onGoingBooking ?? endedBooking
      if (!selected) {
        return null
      }
      return selected
    },
  }) as UseQueryResult<BookingReponse | null>
}
