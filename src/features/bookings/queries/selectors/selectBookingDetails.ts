import { BookingResponseV3 } from 'api/gen'
import { convertBookingResponseDateToTimezone } from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
import { getScreeningDetails } from 'features/bookOffer/helpers/getScreeningDetails'

export type BookingDetailsResponse = ReturnType<typeof selectBookingDetails>

export const selectBookingDetails = (booking: BookingResponseV3) => {
  const bookingWithTimezone = convertBookingResponseDateToTimezone(booking)

  return {
    ...bookingWithTimezone,
    cinemaScreeningDetails: getScreeningDetails(booking.stock.screeningFeatures),
  }
}
