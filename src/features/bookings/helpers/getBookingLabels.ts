import { BookingStockResponse, WithdrawalTypeEnum } from 'api/gen'
import {
  getEventOnSiteWithdrawLabel,
  getLocationLabel,
  getBookingLabelForActivationCode,
} from 'features/bookings/helpers'
import { Booking, BookingProperties } from 'features/bookings/types'
import {
  formatToCompleteFrenchDate,
  formatToCompleteFrenchDateTime,
  formatToFrenchDateWithoutYear,
  formatToHour,
  getTimeZonedDate,
  isToday,
  isTomorrow,
} from 'libs/parsers/formatDates'

export function formatDate({
  date,
  shouldDisplayWeekDay,
  format,
}: {
  date: Date
  shouldDisplayWeekDay?: boolean
  format: 'date' | 'day' | 'dateWithoutYear'
}): string {
  switch (format) {
    case 'date':
      return formatToCompleteFrenchDateTime({ date, shouldDisplayWeekDay })
    case 'day':
      return formatToCompleteFrenchDate({ date, shouldDisplayWeekDay })
    case 'dateWithoutYear':
      return formatToFrenchDateWithoutYear({ date, shouldDisplayWeekDay })
  }
}

export function addPrefix({ prefix, date }: { prefix: string; date: string }): string {
  const dateWithLowerCaseFirstCharacter = date[0] ? date[0].toLowerCase() + date.slice(1) : date
  return `${prefix}${dateWithLowerCaseFirstCharacter}`
}

export function formatEventDateLabel({
  date,
  timezone,
  shouldDisplayWeekDay,
  format,
  prefix,
}: {
  date: Date | string
  timezone: string
  shouldDisplayWeekDay: boolean
  format: 'date' | 'day' | 'dateWithoutYear'
  prefix?: string
}): string {
  const timeZonedDate = getTimeZonedDate({ date, timezone })
  const formatted = formatDate({ date: timeZonedDate, shouldDisplayWeekDay, format })
  return prefix ? addPrefix({ prefix, date: formatted }) : formatted
}

const getDateLabel = (booking: Booking, properties: BookingProperties): string => {
  if (properties.isPermanent) return 'Permanent'

  if (properties.hasActivationCode) {
    return getBookingLabelForActivationCode(booking)
  }

  const {
    stock: {
      beginningDatetime,
      offer: { venue },
    },
  } = booking

  if (properties.isEvent) {
    if (!beginningDatetime) return ''
    return formatEventDateLabel({
      date: new Date(beginningDatetime),
      timezone: venue.timezone,
      shouldDisplayWeekDay: false,
      format: 'date',
      prefix: 'Le ',
    })
  }

  if (properties.isPhysical) {
    if (!booking.expirationDate) return ''
    return formatEventDateLabel({
      date: booking.expirationDate,
      timezone: venue.timezone,
      shouldDisplayWeekDay: false,
      format: 'day',
      prefix: 'À retirer avant le ',
    })
  }

  return ''
}

const getDayLabel = (booking: Booking, properties: BookingProperties): string => {
  if (!properties.isEvent || !booking.stock.beginningDatetime) return ''
  return formatEventDateLabel({
    date: new Date(booking.stock.beginningDatetime),
    timezone: booking.stock.offer.venue.timezone,
    shouldDisplayWeekDay: false,
    format: 'day',
  })
}

const getHourLabel = (booking: Booking, properties: BookingProperties): string => {
  if (!properties.isEvent || !booking.stock.beginningDatetime) return ''
  return formatToHour(
    getTimeZonedDate({
      date: new Date(booking.stock.beginningDatetime),
      timezone: booking.stock.offer.venue.timezone,
    })
  )
}

const getWithdrawLabel = (booking: Booking, properties: BookingProperties): string => {
  if (properties.isEvent)
    return booking.stock.offer.withdrawalType === WithdrawalTypeEnum.on_site
      ? getEventOnSiteWithdrawLabel(booking.stock)
      : getEventWithdrawLabel(booking.stock)

  if (properties.isPhysical) return getPhysicalWithdrawLabel(booking.expirationDate)

  return ''
}

const getPhysicalWithdrawLabel = (expiration: string | null | undefined): string => {
  if (!expiration) return ''
  if (isToday(new Date(expiration))) return 'Dernier jour pour retirer'
  if (isTomorrow(new Date(expiration))) return 'Avant dernier jour pour retirer'
  return ''
}

const getEventWithdrawLabel = (stock: BookingStockResponse): string => {
  if (!stock.beginningDatetime) return ''
  if (isToday(new Date(stock.beginningDatetime))) return 'Aujourd’hui'
  if (isTomorrow(new Date(stock.beginningDatetime))) return 'Demain'
  return ''
}

export const getBookingLabels = (booking: Booking, properties: BookingProperties) => {
  return {
    dateLabel: getDateLabel(booking, properties),
    dayLabel: getDayLabel(booking, properties),
    hourLabel: getHourLabel(booking, properties),
    withdrawLabel: getWithdrawLabel(booking, properties),
    locationLabel: getLocationLabel(booking.stock, properties),
  }
}
