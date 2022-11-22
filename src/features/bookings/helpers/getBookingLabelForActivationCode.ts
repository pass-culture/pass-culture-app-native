import { Booking } from 'features/bookings/types'
import { formatToCompleteFrenchDate } from 'libs/parsers'

export function getBookingLabelForActivationCode(booking: Booking) {
  if (booking.activationCode?.expirationDate) {
    const dateLimit = formatToCompleteFrenchDate(
      new Date(booking.activationCode.expirationDate),
      false
    )
    return `À activer avant le ${dateLimit}`
  }

  return 'À activer'
}
