import { addDays, format, intervalToDuration } from 'date-fns'

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
  return getDigitalBookingWithoutExpirationDate?.some((b) => b.id === booking.id) ?? false
}

const expirationMessages = {
  lastDay: "Ta réservation s'archive aujourd'hui",
  oneDayLeft: "Ta reservation s'archivera demain",
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

export const daysCountdown = (dateCreated: string) => {
  const startDate = new Date()
  const endDate = addDays(new Date(dateCreated), 30)
  const endedCountdown = -1

  if (startDate > endDate) {
    return endedCountdown
  }

  const daysLeftUntilExpiration =
    intervalToDuration({
      start: startDate,
      end: endDate,
    }).days ?? endedCountdown

  return daysLeftUntilExpiration
}

export const formattedExpirationDate = (dateCreated: string) => {
  const bookingDateCreated = new Date(dateCreated)
  const expirationDate = addDays(bookingDateCreated, 30)
  const formattedExpirationDate = format(expirationDate, 'dd/MM/yyyy')
  return formattedExpirationDate
}
