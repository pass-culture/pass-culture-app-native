import { OfferAddressResponse, OfferVenueResponse } from 'api/gen'
import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'

export function getVenue(venue: OfferVenueResponse): VenueBlockVenue {
  return { ...venue, bannerUrl: venue.bannerUrl ?? undefined }
}

export function getAddress(
  address: OfferAddressResponse | null | undefined
): VenueBlockAddress | undefined {
  return address ?? undefined
}
