import { OfferAddressResponse, OfferVenueResponse, SubcategoryIdEnum } from 'api/gen'
import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { formatFullAddress } from 'shared/address/addressFormatter'

export function getVenueSectionTitle(subcategoryId: SubcategoryIdEnum, isEvent: boolean) {
  if (subcategoryId === SubcategoryIdEnum.SEANCE_CINE) return 'Trouve ta séance'
  if (isEvent) return 'Lieu de l’évènement'
  return 'Lieu de retrait'
}

export function getVenueBlockProps(venue: OfferVenueResponse): VenueBlockVenue {
  return { ...venue, bannerUrl: venue.bannerUrl ?? undefined }
}

export function getAddress(
  address: OfferAddressResponse | null | undefined
): VenueBlockAddress | undefined {
  return address ?? undefined
}

export const getVenueSelectionHeaderMessage = (
  selectedLocationMode: LocationMode,
  place?: SuggestedPlace | null,
  venueName?: string
) => {
  switch (selectedLocationMode) {
    case LocationMode.AROUND_PLACE:
      return place?.label ? `Lieux à proximité de “${place?.label}”` : ''
    case LocationMode.EVERYWHERE:
      return venueName ? `Lieux à proximité de “${venueName}”` : ''
    case LocationMode.AROUND_ME:
      return 'Lieux disponibles autour de moi'
  }
}

export const getDisplayedDataVenueBlock = (
  venue: VenueBlockVenue,
  offerAddress?: VenueBlockAddress
) => {
  const street = offerAddress?.street || venue?.address
  const postalCode = offerAddress?.postalCode ?? venue.postalCode
  const city = offerAddress?.city ?? venue.city

  return {
    venueName: offerAddress?.label || venue.name,
    address: formatFullAddress(street, postalCode, city),
    isOfferAddressDifferent: !!offerAddress && offerAddress.id !== venue.addressId,
  }
}

export const getOfferLocationName = (venue: OfferVenueResponse, isDigital: boolean): string =>
  isDigital ? venue.offerer.name : venue.name
