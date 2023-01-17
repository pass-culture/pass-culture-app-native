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

const expirationMessages = {
  lastDay: "Ta réservation s'archive aujourd'hui",
  oneDayLeft: 'Billet à retirer sur place dès demain',
  manyDaysLeft: (daysLeft: number) => `Ta réservation s'archivera dans ${daysLeft} jours`,
}

export const displayExpirationMessage = (daysLeft: number) => {
  let expirationMessage = ''

  if (daysLeft > 1) {
    expirationMessage = expirationMessages.manyDaysLeft(daysLeft)
  } else if (daysLeft === 1) {
    expirationMessage = expirationMessages.oneDayLeft
  } else if (daysLeft === 0) {
    expirationMessage = expirationMessages.lastDay
  }

  return expirationMessage
}
