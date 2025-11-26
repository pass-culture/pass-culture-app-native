import { addDays, format, differenceInDays } from 'date-fns'

import { BookingListItemResponse } from 'api/gen'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'

export const getEligibleBookingsForArchive = (bookings: BookingListItemResponse[]) => {
  const eligibleBookingForArchive = [
    ...getFreeBookingsInSubCategories(bookings),
    ...getDigitalBookingsWithoutExpirationDate(bookings),
  ]

  return eligibleBookingForArchive.filter(
    ({ id }, index) => !eligibleBookingForArchive.map(({ id }) => id).includes(id, index + 1)
  )
}

const getFreeBookingsInSubCategories = (bookings: BookingListItemResponse[]) =>
  bookings.filter(isFreeBookingInSubcategories)

export const getDigitalBookingsWithoutExpirationDate = (bookings: BookingListItemResponse[]) =>
  bookings.filter(isDigitalBookingWithoutExpirationDate)

export const isBookingInList = (
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

export const isDigitalBookingWithoutExpirationDate = (booking: BookingListItemResponse) =>
  booking.stock.offer.isDigital && !booking.expirationDate

export const isFreeBookingInSubcategories = (booking: BookingListItemResponse) =>
  booking.totalAmount === 0 &&
  FREE_OFFER_CATEGORIES_TO_ARCHIVE.includes(booking.stock.offer.subcategoryId)

export const isEligibleBookingsForArchive = (booking: BookingListItemResponse) =>
  isDigitalBookingWithoutExpirationDate(booking) || isFreeBookingInSubcategories(booking)
