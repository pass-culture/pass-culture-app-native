import { UseQueryResult } from 'react-query'

import { BookingReponse, BookingsResponse } from 'api/gen'
import { useBookings } from 'features/bookings/api'

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
