import { UseQueryResult } from 'react-query'

import { BookingReponse, BookingsResponse } from 'api/gen'
import { useBookingsQuery } from 'queries/bookings/useBookingsQuery'

export function useEndedBookingFromOfferIdQuery(
  offerId: number
): UseQueryResult<BookingReponse | null> {
  return useBookingsQuery({
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
