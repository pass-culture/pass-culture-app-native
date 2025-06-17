import { BookingStockResponseV2 } from 'api/gen'
import { BookingProperties } from 'features/bookings/types'

export const getLocationLabel = (
  stock: BookingStockResponseV2,
  properties: BookingProperties
): string => {
  if (properties.isPermanent || properties.isDigital) {
    return ''
  }
  const { venue, address } = stock.offer

  const displayNameVenue = address?.label || venue.name
  return [displayNameVenue, address?.city].filter(Boolean).join(', ')
}
