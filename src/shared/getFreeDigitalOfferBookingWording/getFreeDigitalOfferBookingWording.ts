import { SubcategoryIdEnum } from 'api/gen'

export function getFreeDigitalOfferBookingWording(subcategoryId: SubcategoryIdEnum) {
  switch (subcategoryId) {
    case SubcategoryIdEnum.PODCAST:
      return 'Écouter le podcast'
    case SubcategoryIdEnum.VOD:
      return 'Accéder à la vidéo'
    case SubcategoryIdEnum.LIVRE_NUMERIQUE:
      return 'Accéder au livre'
    case SubcategoryIdEnum.APP_CULTURELLE:
      return 'Télécharger l’application'
    case SubcategoryIdEnum.VISITE_VIRTUELLE:
      return 'Faire la visite virtuelle'
    case SubcategoryIdEnum.JEU_EN_LIGNE:
      return 'Jouer au jeu en ligne'
    default:
      return 'Accéder à l’offre en ligne'
  }
}
