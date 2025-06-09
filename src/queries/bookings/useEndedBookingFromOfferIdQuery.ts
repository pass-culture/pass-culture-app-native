import { UseQueryOptions, UseQueryResult } from 'react-query'

import { BookingReponse, BookingsResponse, BookingsResponseV2 } from 'api/gen'
import { useBookingsQuery, useBookingsQueryV2 } from 'queries/bookings/index'

export const useEndedBookingFromOfferIdQueryV1 = (
  offerId: number,
  options?: UseQueryOptions<BookingsResponse>
): UseQueryResult<BookingReponse | null> => {
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

const findEndedBookingFromOfferId = (bookings: BookingsResponseV2 | null, offerId: number) =>
  bookings?.endedBookings?.find((item: BookingReponse) => item.stock.offer.id === offerId) || null

export const useEndedBookingFromOfferIdQuery = (offerId: number, enabled: boolean) =>
  useBookingsQueryV2(enabled, (data) => findEndedBookingFromOfferId(data, offerId))
