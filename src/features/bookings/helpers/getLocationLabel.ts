import { BookingStockResponse } from 'api/gen'
import { BookingProperties } from 'features/bookings/types'

export function getLocationLabel(
  stock: BookingStockResponse,
  properties: BookingProperties
): string {
  if (properties.isPermanent || properties.isDigital) {
    return ''
  }
  const { venue, address } = stock.offer

  // Do not use ?? as Sonar suggests because if venue.publicName is an empty string we will display an empty string
  const displayNameVenue = address?.label || venue.publicName || venue.name
  return [displayNameVenue, address?.city || venue.city].filter(Boolean).join(', ')
}
