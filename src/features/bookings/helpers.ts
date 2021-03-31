import { CategoryType } from 'api/gen'

import { Booking } from './components/types'

type BookingProperties = {
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

  return {
    isEvent: Boolean(beginningDatetime),
    isPhysical: offer.category.categoryType === CategoryType.Thing,
    isDigital: offer.isDigital,
    isPermanent: offer.isPermanent,
  }
}
