import { SubcategoryIdEnum } from 'api/gen'
import { isArtistPageCompatible } from 'features/venue/helpers/isArtistPageCompatible/isArtistPageCompatible'

describe('isArtistPageCompatible', () => {
  it('should return true for a valid artist and compatible subcategory', () => {
    expect(isArtistPageCompatible('Céline Dion', SubcategoryIdEnum.LIVRE_NUMERIQUE)).toEqual(true)
  })

  it('should return false if artist name is in the excluded list', () => {
    expect(isArtistPageCompatible('Collectif', SubcategoryIdEnum.LIVRE_NUMERIQUE)).toEqual(false)
    expect(isArtistPageCompatible('collectifs', SubcategoryIdEnum.LIVRE_NUMERIQUE)).toEqual(false)
  })

  it('should return false if subcategory is not compatible', () => {
    expect(isArtistPageCompatible('Céline Dion', SubcategoryIdEnum.SEANCE_CINE)).toEqual(false)
  })
})
