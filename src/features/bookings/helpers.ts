import { t } from '@lingui/macro'

import { CategoryType } from 'api/gen'
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
}

export function getBookingProperties(booking?: Booking): BookingProperties {
  if (!booking) {
    return {}
  }

  const { stock } = booking
  const { offer } = stock
  const beginningDatetime = stock.beginningDatetime ? new Date(stock.beginningDatetime) : null
  const isEvent = Boolean(beginningDatetime)

  return {
    isDuo: isEvent && isDuoBooking(booking),
    isEvent,
    isPhysical: offer.category.categoryType === CategoryType.Thing,
    isDigital: offer.isDigital,
    isPermanent: offer.isPermanent,
  }
}

function isDuoBooking(booking: Booking) {
  return booking.quantity === 2
}

export function getBookingLabels(booking: Booking, properties: BookingProperties) {
  const { stock } = booking

  const beginningDatetime = stock.beginningDatetime ? new Date(stock.beginningDatetime) : null
  const expirationDatetime = booking.expirationDate ? new Date(booking.expirationDate) : null
  const shouldNotDisplayLocation =
    properties.isPermanent || (properties.isDigital && properties.isEvent)

  const locationLabel = shouldNotDisplayLocation
    ? ''
    : stock.offer.venue.name + (stock.offer.venue.city ? ',\u00a0' + stock.offer.venue.city : '')

  let dateLabel = ''
  let withdrawLabel = ''

  if (properties.isPermanent) {
    dateLabel = t`Permanent`
  } else if (properties.isEvent) {
    dateLabel = beginningDatetime
      ? t`Le ${formatToCompleteFrenchDateTime(beginningDatetime, false)}`
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
      ? t`À retirer avant le ${formatToCompleteFrenchDate(expirationDatetime)}`
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
