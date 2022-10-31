import { OfferVenueResponse } from 'api/gen'

export const getLocationName = (venue: OfferVenueResponse, isDigital: boolean): string =>
  isDigital ? venue.offerer.name : venue.publicName || venue.name
