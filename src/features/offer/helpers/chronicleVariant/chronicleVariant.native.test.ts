import { BOOK_CLUB_SUBCATEGORIES, CINE_CLUB_SUBCATEGORIES } from 'features/offer/constant'
import { chronicleVariant } from 'features/offer/helpers/chronicleVariant/chronicleVariant'

describe('chronicleVariant', () => {
  it('should define all Book Club subcategories', () => {
    BOOK_CLUB_SUBCATEGORIES.forEach((subcategoryId) => {
      const variant = chronicleVariant[subcategoryId]

      expect(variant).toBeDefined()
      expect(variant.titleSection).toEqual('La reco du Book Club')
      expect(variant.subtitleItem).toEqual('Membre du Book Club')
      expect(variant.Icon).toBeTruthy()
    })
  })

  it('should define all Ciné Club subcategories', () => {
    CINE_CLUB_SUBCATEGORIES.forEach((subcategoryId) => {
      const variant = chronicleVariant[subcategoryId]

      expect(variant).toBeDefined()
      expect(variant.titleSection).toEqual('La reco du Ciné Club')
      expect(variant.subtitleItem).toEqual('Membre du Ciné Club')
      expect(variant.Icon).toBeTruthy()
    })
  })
})
