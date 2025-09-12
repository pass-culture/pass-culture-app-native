import { UseQueryResult } from '@tanstack/react-query'

import { BookingReponse, BookingResponse, BookingsResponse, BookingsResponseV2 } from 'api/gen'
import { useBookingsQuery, useBookingsQueryV2 } from 'queries/bookings'

export const useEndedBookingFromOfferIdQueryV1 = (
  offerId: number,
  enabled: boolean
): UseQueryResult<BookingReponse | null, Error> =>
  useBookingsQuery({
    enabled,
    select: (data: BookingsResponse | null) => findEndedBookingFromOfferIdV1(data, offerId),
  }) as unknown as UseQueryResult<BookingReponse | null, Error>

const findEndedBookingFromOfferIdV1 = (bookings: BookingsResponse | null, offerId: number) =>
  bookings?.ended_bookings?.find((item: BookingReponse) => item.stock.offer.id === offerId) || null

const findEndedBookingFromOfferId = (bookings: BookingsResponseV2 | null, offerId: number) =>
  bookings?.endedBookings?.find((item: BookingResponse) => item.stock.offer.id === offerId) || null

export const useEndedBookingFromOfferIdQuery = (offerId: number, enabled: boolean) =>
  useBookingsQueryV2(enabled, (data) => findEndedBookingFromOfferId(data, offerId))
