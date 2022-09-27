import { BookingStockResponse } from 'api/gen'
import { BookingProperties } from 'features/bookings/types'

export function getLocationLabel(
  stock: BookingStockResponse,
  properties: BookingProperties
): string {
  if (properties.isPermanent || properties.isDigital) {
    return ''
  }
  const { venue } = stock.offer
  const displayNameVenue = venue.publicName || venue.name
  return displayNameVenue + (venue.city ? `, ${venue.city}` : '')
}
