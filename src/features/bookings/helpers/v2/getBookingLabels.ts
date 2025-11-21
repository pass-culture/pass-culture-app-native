import { BookingListItemResponse, BookingListItemStockResponse, WithdrawalTypeEnum } from 'api/gen'
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
  isToday,
  isTomorrow,
} from 'libs/parsers/formatDates'

const formatEventDateLabel = (
  date: Date | string,
  shouldDisplayWeekDay: boolean,
  format: 'date' | 'day',
  prefix?: string
) => {
  return `${prefix ?? ''}${format == 'date' ? formatToCompleteFrenchDateTime({ date: new Date(date), shouldDisplayWeekDay }) : formatToCompleteFrenchDate({ date: new Date(date), shouldDisplayWeekDay })}`
}

const getDateLabel = (booking: BookingListItemResponse, properties: BookingProperties): string => {
  if (properties.isPermanent) return 'Permanent'

  if (properties.hasActivationCode) {
    return getBookingLabelForActivationCodeV2.getBookingLabelForActivationCode(
      booking.activationCode?.expirationDate ?? null
    )
  }

  const {
    stock: { beginningDatetime },
  } = booking

  if (properties.isEvent) {
    if (!beginningDatetime) return ''
    return formatEventDateLabel(new Date(beginningDatetime), false, 'date', 'Le ')
  }

  if (properties.isPhysical) {
    if (!booking.activationCode?.expirationDate) return ''
    return formatEventDateLabel(
      booking.activationCode?.expirationDate,
      false,
      'day',
      'À retirer avant le '
    )
  }

  return ''
}

const getDayLabel = (booking: BookingListItemResponse, properties: BookingProperties): string => {
  if (!properties.isEvent || !booking.stock.beginningDatetime) return ''
  return formatEventDateLabel(new Date(booking.stock.beginningDatetime), false, 'day')
}

const getHourLabel = (booking: BookingListItemResponse, properties: BookingProperties): string => {
  if (!properties.isEvent || !booking.stock.beginningDatetime) return ''
  return formatToHour(new Date(booking.stock.beginningDatetime))
}

const getWithdrawLabel = (
  booking: BookingListItemResponse,
  properties: BookingProperties
): string => {
  if (properties.isEvent)
    return booking.stock.offer.withdrawalType === WithdrawalTypeEnum.on_site
      ? getEventOnSiteWithdrawLabelV2.getEventOnSiteWithdrawLabel(
          booking.stock.beginningDatetime,
          booking.stock.offer.withdrawalDelay
        )
      : getEventWithdrawLabel(booking.stock)

  if (properties.isPhysical) return getPhysicalWithdrawLabel(booking.activationCode?.expirationDate)

  return ''
}

const getPhysicalWithdrawLabel = (expiration: string | null | undefined): string => {
  if (!expiration) return ''
  if (isToday(new Date(expiration))) return 'Dernier jour pour retirer'
  if (isTomorrow(new Date(expiration))) return 'Avant dernier jour pour retirer'
  return ''
}

const getEventWithdrawLabel = (stock: BookingListItemStockResponse): string => {
  if (!stock.beginningDatetime) return ''
  if (isToday(new Date(stock.beginningDatetime))) return 'Aujourd’hui'
  if (isTomorrow(new Date(stock.beginningDatetime))) return 'Demain'
  return ''
}

export const getBookingLabels = (
  booking: BookingListItemResponse,
  properties: BookingProperties
) => {
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
