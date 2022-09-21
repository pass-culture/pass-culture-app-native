import { Booking } from 'features/bookings/components/types'
import { formatToCompleteFrenchDate } from 'libs/parsers'

/**
 * @warning Calling this function assumes appSettings.autoActivateDigitalBookings === true
 * @param booking
 * @param properties
 */
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
