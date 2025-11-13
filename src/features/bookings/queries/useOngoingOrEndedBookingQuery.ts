import { UseQueryResult } from '@tanstack/react-query'

import { BookingReponse, BookingsResponse } from 'api/gen'
import { convertBookingsResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsResponseV2DatesToTimezone'
import { findOngoingOrEndedBooking } from 'features/bookings/queries/selectors/findOngoingOrEndedBooking'
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

export const useOngoingOrEndedBookingQuery = (id: number, enabled = true) =>
  useBookingsQueryV2(enabled, (data) =>
    findOngoingOrEndedBooking(convertBookingsResponseV2DatesToTimezone(data), id)
  )
