import { OfferResponse, SubcategoryIdEnum } from 'api/gen'

const MULTI_VENUE_COMPATIBLE_OFFER = [
  SubcategoryIdEnum.LIVRE_PAPIER,
  SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
]

const isMultiVenueCompatibleOffer = (offer: OfferResponse): boolean =>
  MULTI_VENUE_COMPATIBLE_OFFER.includes(offer.subcategoryId)

export const getIsMultiVenueCompatibleOffer = (offer: OfferResponse) => {
  const shouldFetchSearchVenueOffers = Boolean(
    isMultiVenueCompatibleOffer(offer) && offer.extraData?.ean
  )

  return { shouldFetchSearchVenueOffers }
}
