import { BookingStockResponse, SettingsResponse, WithdrawalTypeEnum } from 'api/gen'
import { Booking } from 'features/bookings/components/types'
import {
  getEventOnSiteWithdrawLabel,
  getLocationLabel,
  getBookingLabelForActivationCode,
} from 'features/bookings/helpers'
import { BookingProperties } from 'features/bookings/helpers/getBookingProperties'
import {
  formatToCompleteFrenchDate,
  formatToCompleteFrenchDateTime,
  isToday,
  isTomorrow,
} from 'libs/parsers'

function getDateLabel(
  booking: Booking,
  properties: BookingProperties,
  appSettings: SettingsResponse | null
): string {
  if (properties.isPermanent) return 'Permanent'

  if (appSettings && appSettings.autoActivateDigitalBookings && properties.hasActivationCode) {
    return getBookingLabelForActivationCode(booking)
  }

  if (properties.isEvent) {
    if (!booking.stock.beginningDatetime) return ''
    const day = formatToCompleteFrenchDateTime(new Date(booking.stock.beginningDatetime), false)
    return `Le ${day}`
  }

  if (properties.isPhysical) {
    if (!booking.expirationDate) return ''
    const dateLimit = formatToCompleteFrenchDate(new Date(booking.expirationDate), false)
    return `À retirer avant le ${dateLimit}`
  }

  return ''
}

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
  if (isToday(new Date(stock.beginningDatetime))) return "Aujourd'hui"
  if (isTomorrow(new Date(stock.beginningDatetime))) return 'Demain'
  return ''
}

export function getBookingLabels(
  booking: Booking,
  properties: BookingProperties,
  appSettings: SettingsResponse | null
) {
  return {
    dateLabel: getDateLabel(booking, properties, appSettings),
    withdrawLabel: getWithdrawLabel(booking, properties),
    locationLabel: getLocationLabel(booking.stock, properties),
  }
}
