import { Booking, BookingProperties } from 'features/bookings/types'

const isDuoBooking = (booking: Booking) => booking.quantity === 2

export const getBookingProperties = (booking: Booking, isEvent: boolean): BookingProperties => {
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
