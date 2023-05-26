import { addDays, format, differenceInDays } from 'date-fns'

import { BookingReponse } from 'api/gen'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'
import { Booking } from 'features/bookings/types'

export function getEligibleBookingsForArchive(bookings: Booking[]) {
  const eligibleBookingForArchive = [
    ...getFreeBookingsInSubCategories(bookings),
    ...getDigitalBookingsWithoutExpirationDate(bookings),
  ]

  return eligibleBookingForArchive.filter(
    ({ id }, index) => !eligibleBookingForArchive.map(({ id }) => id).includes(id, index + 1)
  )
}

export function getFreeBookingsInSubCategories(bookings: Booking[]) {
  return bookings.filter(isFreeBookingInSubcategories)
}

export function getDigitalBookingsWithoutExpirationDate(bookings: Booking[]) {
  return bookings.filter(isDigitalBookingWithoutExpirationDate)
}

export function isBookingInList(booking: Booking, eligibleBookingsForArchive?: Booking[]) {
  return eligibleBookingsForArchive?.some((b) => b.id === booking.id) ?? false
}

const expirationMessages = {
  lastDay: 'Ta réservation s’archive aujourd’hui',
  oneDayLeft: 'Ta reservation s’archivera demain',
  manyDaysLeft: (daysLeft: number) => `Ta réservation s’archivera dans ${daysLeft} jours`,
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

  const daysLeftUntilExpiration = differenceInDays(endDate, startDate) ?? endedCountdown

  return daysLeftUntilExpiration
}

export const formattedExpirationDate = (dateCreated: string) => {
  if (!dateCreated) {
    return ''
  }
  const bookingDateCreated = new Date(dateCreated)
  const expirationDate = addDays(bookingDateCreated, 30)
  const formattedExpirationDate = format(expirationDate, 'dd/MM/yyyy')
  return formattedExpirationDate
}

export const isDigitalBookingWithoutExpirationDate = (booking: BookingReponse) =>
  booking.stock.offer.isDigital && !booking.expirationDate

export const isFreeBookingInSubcategories = (booking: BookingReponse) =>
  booking.stock.price === 0 &&
  FREE_OFFER_CATEGORIES_TO_ARCHIVE.includes(booking.stock.offer.subcategoryId)

export const isEligibleBookingsForArchive = (booking: BookingReponse) =>
  isDigitalBookingWithoutExpirationDate(booking) || isFreeBookingInSubcategories(booking)
