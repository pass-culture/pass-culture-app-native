import { SubcategoryIdEnum } from 'api/gen'

type DigitalOfferBookingWordingType = {
  [subcategoryId in SubcategoryIdEnum]: string
}

const DIGITAL_OFFER_BOOKING_WORDING: Partial<DigitalOfferBookingWordingType> = {
  [SubcategoryIdEnum.PODCAST]: 'Écouter le podcast',
  [SubcategoryIdEnum.VOD]: 'Accéder à la vidéo',
  [SubcategoryIdEnum.LIVRE_NUMERIQUE]: 'Accéder au livre',
  [SubcategoryIdEnum.APP_CULTURELLE]: 'Télécharger l’application',
  [SubcategoryIdEnum.VISITE_VIRTUELLE]: 'Faire la visite virtuelle',
  [SubcategoryIdEnum.JEU_EN_LIGNE]: 'Jouer au jeu en ligne',
}

const DEFAULT_DIGITAL_OFFER_BOOKING_WORDING = 'Accéder à l’offre en ligne'

export function getDigitalOfferBookingWording(subcategoryId: SubcategoryIdEnum) {
  return DIGITAL_OFFER_BOOKING_WORDING[subcategoryId] ?? DEFAULT_DIGITAL_OFFER_BOOKING_WORDING
}
