import { Booking } from 'features/bookings/types'
import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'

export function getBookingLabelForActivationCode(booking: Booking) {
  if (booking.ticket?.activationCode?.expirationDate) {
    const dateLimit = formatToCompleteFrenchDate({
      date: new Date(booking.ticket?.activationCode.expirationDate),
      shouldDisplayWeekDay: false,
    })
    return `À activer avant le ${dateLimit}`
  }

  return 'À activer'
}
