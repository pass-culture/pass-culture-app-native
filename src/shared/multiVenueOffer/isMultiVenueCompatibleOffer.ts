import { OfferResponseV2, SubcategoryIdEnum } from 'api/gen'

const MULTI_VENUE_COMPATIBLE_OFFER = [
  SubcategoryIdEnum.LIVRE_PAPIER,
  SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
]

const isBookMultiVenueCompatibleOffer = (offer: OfferResponseV2): boolean =>
  Boolean(MULTI_VENUE_COMPATIBLE_OFFER.includes(offer.subcategoryId) && offer.extraData?.ean)

const isMovieMultiVenueCompatibleOffer = (offer: OfferResponseV2): boolean =>
  Boolean(SubcategoryIdEnum.SEANCE_CINE === offer.subcategoryId && offer.extraData?.allocineId)

export const isMultiVenueCompatibleOffer = (offer: OfferResponseV2) =>
  isBookMultiVenueCompatibleOffer(offer) || isMovieMultiVenueCompatibleOffer(offer)
