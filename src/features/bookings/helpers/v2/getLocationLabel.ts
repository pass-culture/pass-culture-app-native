import { BookingProperties } from 'features/bookings/types'

export const getLocationLabel = (
  properties: BookingProperties,
  addressLabel: string | undefined,
  addressCity: string | undefined,
  venueName: string
): string => {
  if (properties.isPermanent || properties.isDigital) {
    return ''
  }

  const displayNameVenue = addressLabel ?? venueName
  return [displayNameVenue, addressCity].filter(Boolean).join(', ')
}
