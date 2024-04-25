import { OfferResponse, SubcategoryIdEnum } from 'api/gen'

const MULTI_VENUE_COMPATIBLE_OFFER = [
  SubcategoryIdEnum.LIVRE_PAPIER,
  SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
]

const isBookMultiVenueCompatibleOffer = (offer: OfferResponse): boolean =>
  Boolean(MULTI_VENUE_COMPATIBLE_OFFER.includes(offer.subcategoryId) && offer.extraData?.ean)

const isMovieMultiVenueCompatibleOffer = (offer: OfferResponse): boolean =>
  Boolean(SubcategoryIdEnum.SEANCE_CINE === offer.subcategoryId && offer.extraData?.allocineId)

export const isMultiVenueCompatibleOffer = (offer: OfferResponse, hasNewOfferVenueBlock = false) =>
  isBookMultiVenueCompatibleOffer(offer) ||
  (isMovieMultiVenueCompatibleOffer(offer) && hasNewOfferVenueBlock)
