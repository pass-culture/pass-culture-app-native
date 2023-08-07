import { SubcategoryIdEnum } from 'api/gen'
import { getDigitalOfferBookingWording } from 'shared/getDigitalOfferBookingWording/getDigitalOfferBookingWording'

describe('getFreeDigitalOfferBookingWording', () => {
  it.each`
    subcategoryId                         | wording
    ${SubcategoryIdEnum.PODCAST}          | ${'Écouter le podcast'}
    ${SubcategoryIdEnum.VOD}              | ${'Accéder à la vidéo'}
    ${SubcategoryIdEnum.LIVRE_NUMERIQUE}  | ${'Accéder au livre'}
    ${SubcategoryIdEnum.APP_CULTURELLE}   | ${'Télécharger l’application'}
    ${SubcategoryIdEnum.VISITE_VIRTUELLE} | ${'Faire la visite virtuelle'}
    ${SubcategoryIdEnum.JEU_EN_LIGNE}     | ${'Jouer au jeu en ligne'}
  `(
    'should return $wording when subcategory id is $subcategoryId',
    ({ subcategoryId, wording }) => {
      const freeNumericOfferBookingWording = getDigitalOfferBookingWording(subcategoryId)
      expect(freeNumericOfferBookingWording).toEqual(wording)
    }
  )

  it.each([
    SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
    SubcategoryIdEnum.RENCONTRE,
    SubcategoryIdEnum.SALON,
  ])(
    'should return "Accéder à l’offre en ligne" when subcategory has not a specific wording as %s',
    (subcategoryId) => {
      const freeNumericOfferBookingWording = getDigitalOfferBookingWording(subcategoryId)
      expect(freeNumericOfferBookingWording).toEqual('Accéder à l’offre en ligne')
    }
  )
})
