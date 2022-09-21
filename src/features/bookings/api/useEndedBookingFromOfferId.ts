import { UseQueryResult } from 'react-query'

import { BookingReponse, BookingsResponse } from 'api/gen'
import { useBookings } from 'features/bookings/api/useBookings'

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
