import { BookingResponse, BookingStockResponseV2, WithdrawalTypeEnum } from 'api/gen'
import {
  getLocationLabelV2,
  getEventOnSiteWithdrawLabelV2,
  getBookingLabelForActivationCodeV2,
} from 'features/bookings/helpers'
import { BookingProperties } from 'features/bookings/types'
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

const getDateLabel = (booking: BookingResponse, properties: BookingProperties): string => {
  if (properties.isPermanent) return 'Permanent'

  if (properties.hasActivationCode) {
    return getBookingLabelForActivationCodeV2.getBookingLabelForActivationCode(
      booking.ticket?.activationCode?.expirationDate ?? null
    )
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

const getDayLabel = (booking: BookingResponse, properties: BookingProperties): string => {
  if (!properties.isEvent || !booking.stock.beginningDatetime) return ''
  return formatEventDateLabel(
    new Date(booking.stock.beginningDatetime),
    booking.stock.offer.venue.timezone,
    false,
    'day'
  )
}

const getHourLabel = (booking: BookingResponse, properties: BookingProperties): string => {
  if (!properties.isEvent || !booking.stock.beginningDatetime) return ''
  return formatToHour(
    getTimeZonedDate(new Date(booking.stock.beginningDatetime), booking.stock.offer.venue.timezone)
  )
}

const getWithdrawLabel = (booking: BookingResponse, properties: BookingProperties): string => {
  if (properties.isEvent)
    return booking.ticket?.withdrawal.type === WithdrawalTypeEnum.on_site
      ? getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
          booking.stock.beginningDatetime,
          booking.ticket?.withdrawal.delay
        )
      : getEventWithdrawLabel(booking.stock)

  if (properties.isPhysical) return getPhysicalWithdrawLabel(booking.expirationDate)

  return ''
}

export const getPhysicalWithdrawLabel = (expiration: string | null | undefined): string => {
  if (!expiration) return ''
  if (isToday(new Date(expiration))) return 'Dernier jour pour retirer'
  if (isTomorrow(new Date(expiration))) return 'Avant dernier jour pour retirer'
  return ''
}

const getEventWithdrawLabel = (stock: BookingStockResponseV2): string => {
  if (!stock.beginningDatetime) return ''
  if (isToday(new Date(stock.beginningDatetime))) return 'Aujourd’hui'
  if (isTomorrow(new Date(stock.beginningDatetime))) return 'Demain'
  return ''
}

export const getBookingLabels = (booking: BookingResponse, properties: BookingProperties) => {
  return {
    dateLabel: getDateLabel(booking, properties),
    dayLabel: getDayLabel(booking, properties),
    hourLabel: getHourLabel(booking, properties),
    withdrawLabel: getWithdrawLabel(booking, properties),
    locationLabel: getLocationLabelV2.getLocationLabel(
      properties,
      booking.stock.offer.address?.label ?? undefined,
      booking.stock.offer.address?.city,
      booking.stock.offer.venue.name
    ),
  }
}
