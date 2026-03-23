import { BOOK_CLUB_SUBCATEGORIES, CINE_CLUB_SUBCATEGORIES } from 'features/clubAdvices/constants'
import { clubAdviceVariant } from 'features/clubAdvices/helpers/clubAdviceVariant'

describe('clubAdviceVariant', () => {
  it('should define all book club subcategories', () => {
    BOOK_CLUB_SUBCATEGORIES.forEach((subcategoryId) => {
      const variant = clubAdviceVariant[subcategoryId]

      expect(variant.titleSection).toEqual('Les avis du book club')
    })
  })

  it('should define all ciné club subcategories', () => {
    CINE_CLUB_SUBCATEGORIES.forEach((subcategoryId) => {
      const variant = clubAdviceVariant[subcategoryId]

      expect(variant.titleSection).toEqual('Les avis du ciné club')
    })
  })
})
