import { OfferResponse, SubcategoryIdEnum } from 'api/gen'

const MULTI_VENUE_COMPATIBLE_OFFER = [
  SubcategoryIdEnum.LIVRE_PAPIER,
  SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
]

const isBookMultiVenueCompatibleOffer = (offer: OfferResponse): boolean =>
  Boolean(MULTI_VENUE_COMPATIBLE_OFFER.includes(offer.subcategoryId) && offer.extraData?.ean)

const isMovieMultiVenueCompatibleOffer = (offer: OfferResponse): boolean =>
  Boolean(SubcategoryIdEnum.SEANCE_CINE === offer.subcategoryId && offer.extraData?.allocineId)

export const getIsMultiVenueCompatibleOffer = (
  offer: OfferResponse,
  hasNewOfferVenueBlock = false
) => {
  switch (true) {
    case isBookMultiVenueCompatibleOffer(offer):
      return { shouldFetchSearchVenueOffers: true, multiVenueQuery: offer.extraData?.ean as string }
    case isMovieMultiVenueCompatibleOffer(offer) && hasNewOfferVenueBlock:
      return {
        shouldFetchSearchVenueOffers: true,
        multiVenueQuery: offer.extraData?.allocineId?.toString() as string,
      }
    default:
      return { shouldFetchSearchVenueOffers: false, multiVenueQuery: '' }
  }
}
