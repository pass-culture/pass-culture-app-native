import { UseQueryResult } from '@tanstack/react-query'

import { BookingReponse, BookingResponse, BookingsResponse, BookingsResponseV2 } from 'api/gen'
import { useBookingsQuery, useBookingsQueryV2 } from 'queries/bookings'

export const useOngoingOrEndedBookingQueryV1 = (
  id: number
): UseQueryResult<BookingReponse | null> => {
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

const findOngoingOrEndedBooking = (bookings: BookingsResponseV2 | null, id: number) => {
  const onGoingBooking = bookings?.ongoingBookings?.find((item: BookingResponse) => item.id === id)
  const endedBooking = bookings?.endedBookings?.find((item: BookingResponse) => item.id === id)

  return onGoingBooking ?? (endedBooking || null)
}

export const useOngoingOrEndedBookingQuery = (id: number, enabled: boolean) =>
  useBookingsQueryV2(enabled, (data) => findOngoingOrEndedBooking(data, id))
