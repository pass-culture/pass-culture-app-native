import { OfferVenueResponse } from 'api/gen'
import {
  formatFullAddress,
  formatFullAddressWithVenueName,
} from 'libs/address/useFormatFullAddress'

export function getFormattedAddress(venue: OfferVenueResponse, showVenueBanner: boolean) {
  return showVenueBanner
    ? formatFullAddress(venue.address, venue.postalCode, venue.city)
    : formatFullAddressWithVenueName(
        venue.address,
        venue.postalCode,
        venue.city,
        venue.publicName,
        venue.name
      )
}
