import { SubcategoryIdEnum } from 'api/gen'
import { getTagProps } from 'features/offer/components/InteractionTag/InteractionTag'
import { computedTheme } from 'tests/computedTheme'
import { TagVariant } from 'ui/designSystem/Tag/types'

const subcategoryId = SubcategoryIdEnum.LIVRE_PAPIER

describe('getTagProps', () => {
  it('should return null if no parameters are provided', () => {
    expect(getTagProps({ theme: computedTheme, subcategoryId })).toBeNull()
  })

  it('should return "X avis book club" tag when chroniclesCount > 0', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        chroniclesCount: 1,
        likesCount: 10,
        subcategoryId,
      })
    ).toEqual({
      label: '1 avis book club',
      variant: TagVariant.BOOKCLUB,
    })
  })

  it('should return "j’aime" tag when only likesCount > 0', () => {
    expect(getTagProps({ theme: computedTheme, likesCount: 1, subcategoryId })).toEqual({
      label: '1 j’aime',
      variant: TagVariant.LIKE,
    })
  })

  it('should return null if all counts are 0 or undefined', () => {
    expect(getTagProps({ theme: computedTheme, subcategoryId })).toBeNull()
  })

  it('should use short label when hasSmallLayout is true — "X avis"', () => {
    expect(
      getTagProps({ theme: computedTheme, chroniclesCount: 1, hasSmallLayout: true, subcategoryId })
    ).toEqual({
      label: '1 avis',
      variant: TagVariant.BOOKCLUB,
    })
  })

  it('should return "Bientôt dispo" tag when isComingSoonOffer is true', () => {
    expect(getTagProps({ theme: computedTheme, isComingSoonOffer: true, subcategoryId })).toEqual({
      label: 'Bientôt dispo',
      variant: TagVariant.WARNING,
      Icon: expect.anything(),
    })
  })

  it('should use short label when coming soon and hasSmallLayout', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        isComingSoonOffer: true,
        hasSmallLayout: true,
        subcategoryId,
      })
    ).toEqual({
      label: 'Bientôt',
      variant: TagVariant.WARNING,
      Icon: expect.anything(),
    })
  })

  it('should return "X avis ciné club" tag when chroniclesCount > 0 and subcategory is not a book club', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        chroniclesCount: 1,
        subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      })
    ).toEqual({
      label: '1 avis ciné club',
      variant: TagVariant.CINECLUB,
    })
  })

  it('should return short label "X avis" when chroniclesCount > 0, hasSmallLayout is true, and not a book club', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        chroniclesCount: 1,
        hasSmallLayout: true,
        subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      })
    ).toEqual({
      label: '1 avis',
      variant: TagVariant.CINECLUB,
    })
  })
})
