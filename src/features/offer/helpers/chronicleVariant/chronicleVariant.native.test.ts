import { BOOK_CLUB_SUBCATEGORIES, CINE_CLUB_SUBCATEGORIES } from 'features/offer/constant'
import { chronicleVariant } from 'features/offer/helpers/chronicleVariant/chronicleVariant'

describe('chronicleVariant', () => {
  it('should define all book club subcategories', () => {
    BOOK_CLUB_SUBCATEGORIES.forEach((subcategoryId) => {
      const variant = chronicleVariant[subcategoryId]

      expect(variant.titleSection).toEqual('Les avis du book club')
    })
  })

  it('should define all ciné club subcategories', () => {
    CINE_CLUB_SUBCATEGORIES.forEach((subcategoryId) => {
      const variant = chronicleVariant[subcategoryId]

      expect(variant.titleSection).toEqual('Les avis du ciné club')
    })
  })
})
