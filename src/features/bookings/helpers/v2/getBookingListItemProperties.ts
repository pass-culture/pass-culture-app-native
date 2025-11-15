import { BookingListItemResponse } from 'api/gen'
import { BookingProperties } from 'features/bookings/types'

const isDuoBooking = (quantity: number) => quantity === 2

export const getBookingListItemProperties = (
  booking: BookingListItemResponse,
  isEvent: boolean
): BookingProperties => {
  if (!booking) {
    return {}
  }

  const { stock, activationCode } = booking
  const { offer } = stock

  return {
    isDuo: isDuoBooking(booking.quantity),
    isEvent,
    isPhysical: !isEvent,
    isDigital: offer.isDigital,
    isPermanent: offer.isPermanent,
    hasActivationCode: activationCode != null,
  }
}
