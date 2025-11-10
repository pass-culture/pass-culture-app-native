import { OfferResponseV2, SubcategoryIdEnum } from 'api/gen'

const EAN_MULTI_VENUE_COMPATIBLE_OFFER = new Set([
  SubcategoryIdEnum.LIVRE_PAPIER,
  SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
  SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
  SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE,
])

const isEanMultiVenueCompatibleOffer = (offer: OfferResponseV2): boolean =>
  Boolean(EAN_MULTI_VENUE_COMPATIBLE_OFFER.has(offer.subcategoryId) && offer.extraData?.ean)

const isMovieMultiVenueCompatibleOffer = (offer: OfferResponseV2): boolean =>
  Boolean(SubcategoryIdEnum.SEANCE_CINE === offer.subcategoryId && offer.extraData?.allocineId)

export const isMultiVenueCompatibleOffer = (offer: OfferResponseV2) =>
  isEanMultiVenueCompatibleOffer(offer) || isMovieMultiVenueCompatibleOffer(offer)
