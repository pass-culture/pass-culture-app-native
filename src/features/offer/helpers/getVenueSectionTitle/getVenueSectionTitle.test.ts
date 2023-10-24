import { SubcategoryIdEnum } from 'api/gen'
import { getVenueSectionTitle } from 'features/offer/helpers/getVenueSectionTitle/getVenueSectionTitle'

describe('getVenueSectionTitle', () => {
  it('should return "Lieu de retrait" when subcategory is not "Séances de cinéma" and offer is not an event', () => {
    const venueSectionTitle = getVenueSectionTitle(SubcategoryIdEnum.ABO_BIBLIOTHEQUE, false)

    expect(venueSectionTitle).toEqual('Lieu de retrait')
  })

  it('should return "Lieu de projection" when subcategory is "Séances de cinéma"', () => {
    const venueSectionTitle = getVenueSectionTitle(SubcategoryIdEnum.SEANCE_CINE, false)

    expect(venueSectionTitle).toEqual('Lieu de projection')
  })

  it('should return "Lieu de l’évènement" when offer is an event', () => {
    const venueSectionTitle = getVenueSectionTitle(SubcategoryIdEnum.CONCERT, true)

    expect(venueSectionTitle).toEqual('Lieu de l’évènement')
  })
})
