import { Booking } from 'features/bookings/types'

export function getDigitalBookingWithoutExpirationDate(bookings: Booking[]) {
  return bookings.filter((booking) => {
    const isDigital = booking.stock.offer.isDigital
    return isDigital === true && !booking.expirationDate
  })
}

export function isBookingInList(
  booking: Booking,
  getDigitalBookingWithoutExpirationDate?: Booking[]
) {
  return getDigitalBookingWithoutExpirationDate?.some((b) => b.id === booking.id)
}
