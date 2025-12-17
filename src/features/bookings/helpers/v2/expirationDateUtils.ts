import { addDays, format, differenceInDays } from 'date-fns'

import { BookingListItemResponse } from 'api/gen'

export const getEligibleBookingsForArchive = (bookings: BookingListItemResponse[]) => {
  const eligibleBookingForArchive = [
    ...getFreeBookingsToArchive(bookings),
    ...getDigitalBookingsWithoutExpirationDate(bookings),
  ]

  return eligibleBookingForArchive.filter(
    ({ id }, index) => !eligibleBookingForArchive.map(({ id }) => id).includes(id, index + 1)
  )
}

const getFreeBookingsToArchive = (bookings: BookingListItemResponse[]) =>
  bookings.filter((booking) => booking.stock.isAutomaticallyUsed)

export const getDigitalBookingsWithoutExpirationDate = (bookings: BookingListItemResponse[]) =>
  bookings.filter(isDigitalBookingWithoutExpirationDate)

export const isBookingEligibleForArchive = (
  booking: BookingListItemResponse,
  eligibleBookingsForArchive?: BookingListItemResponse[]
) => eligibleBookingsForArchive?.some((b) => b.id === booking.id) ?? false

const expirationMessages = {
  lastDay: 'Ta réservation s’archive aujourd’hui',
  oneDayLeft: 'Ta reservation s’archivera demain',
  manyDaysLeft: (daysLeft: number) => `Ta réservation s’archivera dans ${daysLeft} jours`,
}

export const displayExpirationMessage = (daysLeft: number) => {
  if (daysLeft > 1) {
    return expirationMessages.manyDaysLeft(daysLeft)
  } else if (daysLeft === 1) {
    return expirationMessages.oneDayLeft
  } else if (daysLeft === 0) {
    return expirationMessages.lastDay
  }

  return ''
}

export const daysCountdown = (dateCreated: string) => {
  const startDate = new Date()
  const endDate = addDays(new Date(dateCreated), 30)
  const endedCountdown = -1

  if (startDate > endDate) {
    return endedCountdown
  }

  return differenceInDays(endDate, startDate) ?? endedCountdown
}

export const formattedExpirationDate = (dateCreated: string) => {
  if (!dateCreated) {
    return ''
  }
  const bookingDateCreated = new Date(dateCreated)
  const expirationDate = addDays(bookingDateCreated, 30)
  return format(expirationDate, 'dd/MM/yyyy')
}

export const isDigitalBookingWithoutExpirationDate = (booking: BookingListItemResponse) =>
  booking.stock.offer.isDigital && !booking.expirationDate

export const isArchivableBooking = (booking: BookingListItemResponse) =>
  isDigitalBookingWithoutExpirationDate(booking) || booking.isArchivable
