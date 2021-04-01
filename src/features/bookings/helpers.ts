import { CategoryType } from 'api/gen'

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
