import { convertBookingsResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { findOngoingOrEndedBooking } from 'features/bookings/queries/selectors/findOngoingOrEndedBooking'
import { useBookingsV2Query } from 'queries/bookings'

export const useOngoingOrEndedBookingQueryV2 = (id: number, enabled = true) =>
  useBookingsV2Query(enabled, (data) =>
    findOngoingOrEndedBooking(convertBookingsResponseV2DatesToTimezone(data), id)
  )
