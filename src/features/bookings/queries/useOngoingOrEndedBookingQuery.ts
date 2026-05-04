import { convertBookingsResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { findOngoingOrEndedBooking } from 'features/bookings/queries/selectors/findOngoingOrEndedBooking'
import { useBookingsV2Query } from 'queries/bookings/useBookingsQuery'

export const useOngoingOrEndedBookingQueryV2 = (id: number) =>
  useBookingsV2Query({
    select: (data) => findOngoingOrEndedBooking(convertBookingsResponseV2DatesToTimezone(data), id),
  })
