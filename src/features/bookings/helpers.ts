import { t } from '@lingui/macro'

import { CategoryType, SettingsResponse } from 'api/gen'
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

export function getBookingProperties(booking?: Booking): BookingProperties {
  if (!booking) {
    return {}
  }

  const { stock } = booking
  const { offer } = stock
  const isEvent = offer.category.categoryType === CategoryType.Event

  return {
    isDuo: isEvent && isDuoBooking(booking),
    isEvent,
    isPhysical: offer.category.categoryType === CategoryType.Thing,
    isDigital: offer.isDigital,
    isPermanent: offer.isPermanent,
    hasActivationCode: booking.activationCode != null,
  }
}

function isDuoBooking(booking: Booking) {
  return booking.quantity === 2
}

export function getBookingLabels(
  booking: Booking,
  properties: BookingProperties,
  appSettings: SettingsResponse | null
) {
  const { stock } = booking

  const beginningDatetime = stock.beginningDatetime ? new Date(stock.beginningDatetime) : null
  const expirationDatetime = booking.expirationDate ? new Date(booking.expirationDate) : null
  const shouldNotDisplayLocation = properties.isPermanent || properties.isDigital

  const locationLabel = shouldNotDisplayLocation
    ? ''
    : stock.offer.venue.name + (stock.offer.venue.city ? ',\u00a0' + stock.offer.venue.city : '')

  let dateLabel = ''
  let withdrawLabel = ''

  if (properties.isPermanent) {
    dateLabel = t`Permanent`
  } else if (
    appSettings &&
    appSettings.autoActivateDigitalBookings &&
    properties.hasActivationCode
  ) {
    dateLabel = getBookingLabelForActivationCode(booking)
  } else if (properties.isEvent) {
    dateLabel = beginningDatetime
      ? t({
          id: 'le jour',
          values: { day: formatToCompleteFrenchDateTime(beginningDatetime, false) },
          message: 'Le {day}',
        })
      : ''

    const isBeginningToday = beginningDatetime ? isToday(beginningDatetime) : false
    const isBeginningTomorrow = beginningDatetime ? isTomorrow(beginningDatetime) : false
    if (isBeginningToday) {
      withdrawLabel = t`Aujourd'hui`
    } else if (isBeginningTomorrow) {
      withdrawLabel = t`Demain`
    }
  } else if (properties.isPhysical) {
    dateLabel = expirationDatetime
      ? t({
          id: 'withdraw before date',
          values: { dateLimit: formatToCompleteFrenchDate(expirationDatetime, false) },
          message: 'À retirer avant le {dateLimit}',
        })
      : ''

    const isExpiringToday = expirationDatetime ? isToday(expirationDatetime) : false
    const isExpiringTomorrow = expirationDatetime ? isTomorrow(expirationDatetime) : false
    if (isExpiringToday) {
      withdrawLabel = t`Dernier jour pour retirer`
    } else if (isExpiringTomorrow) {
      withdrawLabel = t`Avant dernier jour pour retirer`
    }
  }

  return { dateLabel, withdrawLabel, locationLabel }
}

/**
 * @warning Calling this function assumes appSettings.autoActivateDigitalBookings === true
 * @param booking
 * @param properties
 */
export function getBookingLabelForActivationCode(booking: Booking) {
  let dateLabel = ''

  if (booking.activationCode?.expirationDate) {
    const dateLimit = formatToCompleteFrenchDate(
      new Date(booking.activationCode.expirationDate),
      false
    )

    dateLabel = t({
      id: 'activate before date',
      values: { dateLimit },
      message: 'À activer avant le {dateLimit}',
    })
  } else {
    dateLabel = t`À activer`
  }

  return dateLabel
}
