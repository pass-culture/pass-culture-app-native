import { Booking, BookingProperties } from 'features/bookings/types'

function isDuoBooking(booking: Booking) {
  return booking.quantity === 2
}

export function getBookingProperties(booking: Booking, isEvent: boolean): BookingProperties {
  if (!booking) {
    return {}
  }

  const { stock } = booking
  const { offer } = stock

  return {
    isDuo: isDuoBooking(booking),
    isEvent,
    isPhysical: !isEvent,
    isDigital: offer.isDigital,
    isPermanent: offer.isPermanent,
    hasActivationCode: booking.activationCode != null,
  }
}
