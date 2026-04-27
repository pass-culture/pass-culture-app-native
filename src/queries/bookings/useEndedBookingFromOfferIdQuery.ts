import { BookingResponse, BookingsResponseV2 } from 'api/gen'
import { useBookingsV2Query } from 'queries/bookings'

const findEndedBookingFromOfferId = (bookings: BookingsResponseV2 | null, offerId: number) =>
  bookings?.endedBookings?.find((item: BookingResponse) => item.stock.offer.id === offerId) || null

export const useEndedBookingFromOfferIdQueryV2 = (offerId: number, enabled: boolean) =>
  useBookingsV2Query(enabled, (data) => findEndedBookingFromOfferId(data, offerId))
