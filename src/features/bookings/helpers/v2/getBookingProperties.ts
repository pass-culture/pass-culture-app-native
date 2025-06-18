import { BookingResponse } from 'api/gen'
import { BookingProperties } from 'features/bookings/types'

const isDuoBooking = (quantity: number) => quantity === 2

export const getBookingProperties = (
  booking: BookingResponse,
  isEvent: boolean
): BookingProperties => {
  if (!booking) {
    return {}
  }

  const { stock } = booking
  const { offer } = stock

  return {
    isDuo: isDuoBooking(booking.quantity),
    isEvent,
    isPhysical: !isEvent,
    isDigital: offer.isDigital,
    isPermanent: offer.isPermanent,
    hasActivationCode: booking.ticket?.activationCode != null,
  }
}
