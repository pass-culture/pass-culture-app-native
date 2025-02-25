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
  getTimeZonedDate,
  isToday,
  isTomorrow,
} from 'libs/parsers/formatDates'

const getDateLabel = (booking: Booking, properties: BookingProperties): string => {
  if (properties.isPermanent) return 'Permanent'

  if (properties.hasActivationCode) {
    return getBookingLabelForActivationCode(booking)
  }

  if (properties.isEvent) 
    return getLabel(booking, booking.stock.beginningDatetime, booking.stock.offer.venue.timezone, 'Le')
  

  if (properties.isPhysical) {
    return getLabel(booking, booking.expirationDate, booking.stock.offer.venue.timezone, 'À retirer avant le')
  }

  return ''
}

const getPropertyLabel = ( booking: Booking, date: string, timezone: string, prefix: string ) =>
  `${prefix} ${formatToCompleteFrenchDateTime(getTimeZonedDate(date, timezone), false)}`


const getLabel = (booking: Booking, date: string | null | undefined, timezone: string, prefix: string) =>
  !!date ? getPropertyLabel(booking, date, timezone, prefix) : ''


function getWithdrawLabel(booking: Booking, properties: BookingProperties): string {
  if (properties.isEvent)
    return booking.stock.offer.withdrawalType === WithdrawalTypeEnum.on_site
      ? getEventOnSiteWithdrawLabel(booking.stock)
      : getEventWithdrawLabel(booking.stock)

  if (properties.isPhysical) return getPhysicalWithdrawLabel(booking.expirationDate)

  return ''
}

function getPhysicalWithdrawLabel(expiration: string | null | undefined): string {
  if (!expiration) return ''
  if (isToday(new Date(expiration))) return 'Dernier jour pour retirer'
  if (isTomorrow(new Date(expiration))) return 'Avant dernier jour pour retirer'
  return ''
}

function getEventWithdrawLabel(stock: BookingStockResponse): string {
  if (!stock.beginningDatetime) return ''
  if (isToday(new Date(stock.beginningDatetime))) return 'Aujourd’hui'
  if (isTomorrow(new Date(stock.beginningDatetime))) return 'Demain'
  return ''
}

export function getBookingLabels(booking: Booking, properties: BookingProperties) {
  return {
    dateLabel: getDateLabel(booking, properties),
    withdrawLabel: getWithdrawLabel(booking, properties),
    locationLabel: getLocationLabel(booking.stock, properties),
  }
}
