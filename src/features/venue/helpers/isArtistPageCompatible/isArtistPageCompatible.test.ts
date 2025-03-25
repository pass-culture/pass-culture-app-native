import { SubcategoryIdEnum } from 'api/gen'
import { isArtistPageCompatible } from 'features/venue/helpers/isArtistPageCompatible/isArtistPageCompatible'

describe('isArtistPageCompatible', () => {
  it('should return true for a compatible subcategory', () => {
    expect(isArtistPageCompatible(SubcategoryIdEnum.LIVRE_NUMERIQUE)).toEqual(true)
  })

  it('should return false if subcategory is not compatible', () => {
    expect(isArtistPageCompatible(SubcategoryIdEnum.SEANCE_CINE)).toEqual(false)
  })
})
