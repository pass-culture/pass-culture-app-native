import { SubcategoryIdEnum } from 'api/gen'
import { getTagProps } from 'features/offer/components/InteractionTag/InteractionTag'
import { computedTheme } from 'tests/computedTheme'
import { TagVariant } from 'ui/designSystem/Tag/types'

const subcategoryId = SubcategoryIdEnum.LIVRE_PAPIER

describe('getTagProps', () => {
  it('should return null if no parameters are provided', () => {
    expect(getTagProps({ theme: computedTheme, subcategoryId })).toBeNull()
  })

  it('should return "X avis book club" tag when advicesCount > 0', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        clubAdvicesCount: 1,
        likesCount: 10,
        subcategoryId,
      })
    ).toEqual({
      label: '1 avis book club',
      variant: TagVariant.BOOKCLUB,
    })
  })

  it('should return "X avis des pros" tag when proAdvicesCount > 0 and no club advices', () => {
    expect(
      getTagProps({ theme: computedTheme, proAdvicesCount: 1, likesCount: 10, subcategoryId })
    ).toEqual({
      label: '1 avis des pros',
      variant: TagVariant.PROEDITO,
    })
  })

  it('should return "j\u2019aime" tag when only likesCount > 0', () => {
    expect(getTagProps({ theme: computedTheme, likesCount: 1, subcategoryId })).toEqual({
      label: '1 j\u2019aime',
      variant: TagVariant.LIKE,
    })
  })

  it('should return null if all counts are 0 or undefined', () => {
    expect(getTagProps({ theme: computedTheme, subcategoryId })).toBeNull()
  })

  it('should use short label when hasSmallLayout is true \u2014 "X avis" when proAdvicesCount > 0 and no club advices', () => {
    expect(
      getTagProps({ theme: computedTheme, proAdvicesCount: 1, hasSmallLayout: true, subcategoryId })
    ).toEqual({
      label: '1 avis',
      variant: TagVariant.PROEDITO,
    })
  })

  it('should use short label when hasSmallLayout is true \u2014 "X avis" when club advices > 0', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        clubAdvicesCount: 1,
        hasSmallLayout: true,
        subcategoryId,
      })
    ).toEqual({
      label: '1 avis',
      variant: TagVariant.BOOKCLUB,
    })
  })

  it('should return "Bient\u00f4t dispo" tag when isComingSoonOffer is true', () => {
    expect(getTagProps({ theme: computedTheme, isComingSoonOffer: true, subcategoryId })).toEqual({
      label: 'Bient\u00f4t dispo',
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
      label: 'Bient\u00f4t',
      variant: TagVariant.WARNING,
      Icon: expect.anything(),
    })
  })

  it('should return "X avis cin\u00e9 club" tag when advicesCount > 0 and subcategory is not a book club', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        clubAdvicesCount: 1,
        subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      })
    ).toEqual({
      label: '1 avis cin\u00e9 club',
      variant: TagVariant.CINECLUB,
    })
  })

  it('should return short label "X avis" when advicesCount > 0, hasSmallLayout is true, and not a book club', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        clubAdvicesCount: 1,
        hasSmallLayout: true,
        subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      })
    ).toEqual({
      label: '1 avis',
      variant: TagVariant.CINECLUB,
    })
  })

  it('should return "X avis scène club" tag when advicesCount > 0 and subcategory is a scene club', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        clubAdvicesCount: 3,
        subcategoryId: SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
        enableSceneClubTag: true,
      })
    ).toEqual({
      label: '3 avis scène club',
      variant: TagVariant.SCENECLUB,
    })
  })

  it('should return short label "X avis" when advicesCount > 0, hasSmallLayout is true, and subcategory is a scene club', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        clubAdvicesCount: 3,
        hasSmallLayout: true,
        subcategoryId: SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
        enableSceneClubTag: true,
      })
    ).toEqual({
      label: '3 avis',
      variant: TagVariant.SCENECLUB,
    })
  })

  it('should not return a club tag when subcategory is a scene club and scene club tag is disabled', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        clubAdvicesCount: 3,
        subcategoryId: SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
      })
    ).toBeNull()
  })

  it('should fall back to the likes tag when subcategory is a scene club and scene club tag is disabled', () => {
    expect(
      getTagProps({
        theme: computedTheme,
        clubAdvicesCount: 3,
        likesCount: 10,
        subcategoryId: SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
      })
    ).toEqual({
      label: '10 j’aime',
      variant: TagVariant.LIKE,
    })
  })

  it.each([SubcategoryIdEnum.CONCERT, SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD])(
    'should not return a club tag when advicesCount > 0 and subcategory %s belongs to no club',
    (subcategoryId) => {
      expect(
        getTagProps({
          theme: computedTheme,
          clubAdvicesCount: 3,
          subcategoryId,
          enableSceneClubTag: true,
        })
      ).toBeNull()
    }
  )
})
