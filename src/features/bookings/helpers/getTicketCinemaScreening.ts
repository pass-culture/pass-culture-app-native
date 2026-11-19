import { BookingResponse, ScreeningFeatures } from 'api/gen'
import { hasCinemaScreeningFeatures } from 'features/bookings/helpers/hasCinemaScreeningFeatures'
import { BookingDetailsResponse } from 'features/bookings/queries/selectors/selectBookingDetails'

type TicketCinemaScreening = {
  features: ScreeningFeatures
  hasDetails: boolean
}

export const getTicketCinemaScreening = (
  booking: BookingResponse | BookingDetailsResponse,
  isEnabled: boolean
): TicketCinemaScreening | undefined => {
  if (!isEnabled || !('cinemaScreeningDetails' in booking)) return undefined

  const { screeningFeatures } = booking.stock
  if (!hasCinemaScreeningFeatures(screeningFeatures)) return undefined

  return {
    features: screeningFeatures,
    hasDetails: booking.cinemaScreeningDetails.length > 0,
  }
}
