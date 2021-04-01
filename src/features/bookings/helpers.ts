import { t } from '@lingui/macro'

import { CategoryType } from 'api/gen'
import { _ } from 'libs/i18n'
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
    properties.isPermanent ||
    (properties.isDigital && stock.offer.category.categoryType === CategoryType.Event)

  const locationLabel = shouldNotDisplayLocation
    ? ''
    : stock.offer.venue.name + (stock.offer.venue.city ? ',\u00a0' + stock.offer.venue.city : '')

  let dateLabel = ''
  let withdrawLabel = ''

  if (properties.isPermanent) {
    dateLabel = _(t`Permanent`)
  } else if (properties.isEvent) {
    dateLabel = beginningDatetime
      ? _(t`Le\u00a0`) + formatToCompleteFrenchDateTime(beginningDatetime, false)
      : ''

    const isBeginningToday = beginningDatetime ? isToday(beginningDatetime) : false
    const isBeginningTomorrow = beginningDatetime ? isTomorrow(beginningDatetime) : false
    if (isBeginningToday) {
      withdrawLabel = _(t`Aujourd'hui`)
    } else if (isBeginningTomorrow) {
      withdrawLabel = _(t`Demain`)
    }
  } else if (properties.isPhysical) {
    dateLabel = expirationDatetime
      ? _(t`À retirer avant le\u00a0`) + formatToCompleteFrenchDate(expirationDatetime)
      : ''

    const isExpiringToday = expirationDatetime ? isToday(expirationDatetime) : false
    const isExpiringTomorrow = expirationDatetime ? isTomorrow(expirationDatetime) : false
    if (isExpiringToday) {
      withdrawLabel = _(t`Dernier jour pour retirer`)
    } else if (isExpiringTomorrow) {
      withdrawLabel = _(t`Avant dernier jour pour retirer`)
    }
  }

  return { dateLabel, withdrawLabel, locationLabel }
}
