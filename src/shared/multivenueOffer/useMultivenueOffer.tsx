import { OfferResponse, SubcategoryIdEnum } from 'api/gen'

const MULTIVENUE_COMPATIBLE_OFFER = [
  SubcategoryIdEnum.LIVRE_PAPIER,
  SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
]

const isMultivenueCompatibleOffer = (offer: OfferResponse): boolean =>
  MULTIVENUE_COMPATIBLE_OFFER.includes(offer.subcategoryId)

export const getIsMultivenueCompatibleOffer = (offer: OfferResponse) => {
  const shouldFetchSearchVenueOffers = Boolean(
    isMultivenueCompatibleOffer(offer) && offer.extraData?.ean
  )

  return { shouldFetchSearchVenueOffers }
}
