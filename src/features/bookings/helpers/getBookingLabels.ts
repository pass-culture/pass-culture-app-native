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
  formatToHour,
  getTimeZonedDate,
  isToday,
  isTomorrow,
} from 'libs/parsers/formatDates'

const formatEventDateLabel = (
  date: Date | string,
  timezone: string,
  shouldDisplayWeekDay: boolean,
  format: 'date' | 'day',
  prefix?: string
) => {
  return `${prefix ?? ''}${format == 'date' ? formatToCompleteFrenchDateTime(getTimeZonedDate(date, timezone), shouldDisplayWeekDay) : formatToCompleteFrenchDate(getTimeZonedDate(date, timezone), shouldDisplayWeekDay)}`
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
    return formatEventDateLabel(new Date(beginningDatetime), venue.timezone, false, 'date', 'Le ')
  }

  if (properties.isPhysical) {
    if (!booking.expirationDate) return ''
    return formatEventDateLabel(
      booking.expirationDate,
      venue.timezone,
      false,
      'day',
      'À retirer avant le '
    )
  }

  return ''
}

const getDayLabel = (booking: Booking, properties: BookingProperties): string => {
  if (!properties.isEvent || !booking.stock.beginningDatetime) return ''
  return formatEventDateLabel(
    new Date(booking.stock.beginningDatetime),
    booking.stock.offer.venue.timezone,
    false,
    'day'
  )
}

const getHourLabel = (booking: Booking, properties: BookingProperties): string => {
  if (!properties.isEvent || !booking.stock.beginningDatetime) return ''
  return formatToHour(
    getTimeZonedDate(new Date(booking.stock.beginningDatetime), booking.stock.offer.venue.timezone)
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
