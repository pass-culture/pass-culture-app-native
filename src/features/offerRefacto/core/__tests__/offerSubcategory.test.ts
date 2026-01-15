import { SubcategoryIdEnum } from 'api/gen'
import { getIsMusicSupport } from 'features/offerRefacto/core'

describe('getIsMusicSupport', () => {
  it('should return false if subcategoryId is undefined', () => {
    expect(getIsMusicSupport(undefined)).toEqual(false)
  })

  it('should return true for CD support', () => {
    const result = getIsMusicSupport(SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD)

    expect(result).toEqual(true)
  })

  it('should return true for Vinyl support', () => {
    const result = getIsMusicSupport(SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_VINYLE)

    expect(result).toEqual(true)
  })

  it('should return false for a non-music subcategory', () => {
    const result = getIsMusicSupport(SubcategoryIdEnum.LIVRE_PAPIER)

    expect(result).toEqual(false)
  })
})
