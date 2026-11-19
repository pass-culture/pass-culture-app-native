import { BookingResponseV3 } from 'api/gen'
import { convertBookingResponseDateToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { selectCinemaScreeningDetails } from 'features/bookings/queries/selectors/selectCinemaScreeningDetails'

export type BookingDetailsResponse = ReturnType<typeof selectBookingDetails>

export const selectBookingDetails = (booking: BookingResponseV3) => {
  const bookingWithTimezone = convertBookingResponseDateToTimezone(booking)

  return {
    ...bookingWithTimezone,
    cinemaScreeningDetails: selectCinemaScreeningDetails(booking.stock.screeningFeatures),
  }
}
