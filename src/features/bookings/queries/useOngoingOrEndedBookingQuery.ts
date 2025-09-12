import { UseQueryResult } from '@tanstack/react-query'

import { BookingReponse, BookingResponse, BookingsResponse, BookingsResponseV2 } from 'api/gen'
import { useBookingsQuery, useBookingsQueryV2 } from 'queries/bookings'

export const useOngoingOrEndedBookingQueryV1 = (
  id: number
): UseQueryResult<BookingReponse | null, Error> =>
  useBookingsQuery({
    select: (data: BookingsResponse | null) => findOngoingOrEndedBookingV1(data, id),
  }) as unknown as UseQueryResult<BookingReponse | null, Error>

const findOngoingOrEndedBookingV1 = (bookings: BookingsResponse | null, id: number) => {
  const onGoingBooking = bookings?.ongoing_bookings?.find((item: BookingReponse) => item.id === id)
  const endedBooking = bookings?.ended_bookings?.find((item: BookingReponse) => item.id === id)

  return onGoingBooking ?? (endedBooking || null)
}

const findOngoingOrEndedBooking = (bookings: BookingsResponseV2 | null, id: number) => {
  const onGoingBooking = bookings?.ongoingBookings?.find((item: BookingResponse) => item.id === id)
  const endedBooking = bookings?.endedBookings?.find((item: BookingResponse) => item.id === id)

  return onGoingBooking ?? (endedBooking || null)
}

export const useOngoingOrEndedBookingQuery = (id: number, enabled: boolean) =>
  useBookingsQueryV2(enabled, (data) => findOngoingOrEndedBooking(data, id))
