import { t } from '@lingui/macro'

import { BookingStockResponse, SettingsResponse } from 'api/gen'
import {
  formatToCompleteFrenchDate,
  formatToCompleteFrenchDateTime,
  isToday,
  isTomorrow,
} from 'libs/parsers'

import { Booking } from './components/types'

export type BookingProperties = {
  isDuo?: boolean
  isEvent?: boolean
  isPhysical?: boolean
  isDigital?: boolean
  isPermanent?: boolean
  hasActivationCode?: boolean
}

export function getBookingProperties(booking: Booking, isEvent: boolean): BookingProperties {
  if (!booking) {
    return {}
  }

  const { stock } = booking
  const { offer } = stock

  return {
    isDuo: isDuoBooking(booking),
    isEvent,
    isPhysical: !isEvent,
    isDigital: offer.isDigital,
    isPermanent: offer.isPermanent,
    hasActivationCode: booking.activationCode != null,
  }
}

function isDuoBooking(booking: Booking) {
  return booking.quantity === 2
}

function getDateLabel(
  booking: Booking,
  properties: BookingProperties,
  appSettings: SettingsResponse | null
): string {
  if (properties.isPermanent) return t`Permanent`

  if (appSettings && appSettings.autoActivateDigitalBookings && properties.hasActivationCode) {
    return getBookingLabelForActivationCode(booking)
  }

  if (properties.isEvent) {
    if (!booking.stock.beginningDatetime) return ''
    const day = formatToCompleteFrenchDateTime(new Date(booking.stock.beginningDatetime), false)
    return t`Le ${day}`
  }

  if (properties.isPhysical) {
    if (!booking.expirationDate) return ''
    const dateLimit = formatToCompleteFrenchDate(new Date(booking.expirationDate), false)
    return t`À retirer avant le ${dateLimit}`
  }

  return ''
}

function getEventWithdrawLabel(beginning: string | null | undefined): string {
  if (!beginning) return ''
  if (isToday(new Date(beginning))) return t`Aujourd'hui`
  if (isTomorrow(new Date(beginning))) return t`Demain`
  return ''
}

function getPhysicalWithdrawLabel(expiration: string | null | undefined): string {
  if (!expiration) return ''
  if (isToday(new Date(expiration))) return t`Dernier jour pour retirer`
  if (isTomorrow(new Date(expiration))) return t`Avant dernier jour pour retirer`
  return ''
}

function getWithdrawLabel(booking: Booking, properties: BookingProperties): string {
  if (properties.isEvent) return getEventWithdrawLabel(booking.stock.beginningDatetime)
  if (properties.isPhysical) return getPhysicalWithdrawLabel(booking.expirationDate)
  return ''
}

function getLocationLabel(stock: BookingStockResponse, properties: BookingProperties): string {
  if (properties.isPermanent || properties.isDigital) {
    return ''
  }
  const { venue } = stock.offer
  return venue.name + (venue.city ? ',\u00a0' + venue.city : '')
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

/**
 * @warning Calling this function assumes appSettings.autoActivateDigitalBookings === true
 * @param booking
 * @param properties
 */
export function getBookingLabelForActivationCode(booking: Booking) {
  if (booking.activationCode?.expirationDate) {
    const dateLimit = formatToCompleteFrenchDate(
      new Date(booking.activationCode.expirationDate),
      false
    )

    return t({
      id: 'activate before date',
      values: { dateLimit },
      message: 'À activer avant le {dateLimit}',
    })
  }

  return t`À activer`
}
