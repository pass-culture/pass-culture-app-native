import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'

import { BookingReponse, BookingsResponse } from 'api/gen'
import { useBookingsQuery } from 'queries/bookings/useBookingsQuery'

export function useEndedBookingFromOfferIdQuery(
  offerId: number,
  options?: UseQueryOptions<BookingsResponse>
): UseQueryResult<BookingReponse | null> {
  return useBookingsQuery({
    ...options,
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
