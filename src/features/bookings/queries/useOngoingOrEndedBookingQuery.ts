import { UseQueryResult } from '@tanstack/react-query'

import { BookingReponse, BookingsResponse } from 'api/gen'
import { convertOffererDatesToTimezone } from 'features/bookings/queries/selectors/convertOffererDatesToTimezone'
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

export const useOngoingOrEndedBookingQuery = (id: number, enabled: boolean) =>
  useBookingsQueryV2(enabled, (data) =>
    findOngoingOrEndedBooking(convertOffererDatesToTimezone(data), id)
  )
