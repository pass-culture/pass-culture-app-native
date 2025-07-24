import { SubcategoryIdEnum } from 'api/gen'
import {
  getTagProps,
  renderInteractionTag,
} from 'features/offer/components/InteractionTag/InteractionTag'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { TagVariant } from 'ui/components/Tag/types'

const subcategoryId = SubcategoryIdEnum.LIVRE_PAPIER

describe('getTagProps', () => {
  it('should return null if no parameters are provided', () => {
    expect(getTagProps({ theme, subcategoryId })).toBeNull()
  })

  it('should return "Reco du Club" tag when chroniclesCount > 0', () => {
    expect(
      getTagProps({ theme, chroniclesCount: 1, headlinesCount: 10, likesCount: 10, subcategoryId })
    ).toEqual({
      label: 'Reco du Book Club',
      variant: TagVariant.BOOKCLUB,
    })
  })

  it('should return "Reco par les lieux" tag when headlinesCount > 0 and no chronicles', () => {
    expect(getTagProps({ theme, headlinesCount: 1, likesCount: 10, subcategoryId })).toEqual({
      label: 'Reco par les lieux',
      variant: TagVariant.HEADLINE,
    })
  })

  it('should return "j’aime" tag when only likesCount > 0', () => {
    expect(getTagProps({ theme, likesCount: 1, subcategoryId })).toEqual({
      label: '1 j’aime',
      variant: TagVariant.LIKE,
    })
  })

  it('should return null if all counts are 0 or undefined', () => {
    expect(getTagProps({ theme, subcategoryId })).toBeNull()
  })

  it('should use short label when hasSmallLayout is true — "Reco lieux"', () => {
    expect(getTagProps({ theme, headlinesCount: 1, hasSmallLayout: true, subcategoryId })).toEqual({
      label: 'Reco lieux',
      variant: TagVariant.HEADLINE,
    })
  })

  it('should use short label when hasSmallLayout is true — "Reco Club"', () => {
    expect(getTagProps({ theme, chroniclesCount: 1, hasSmallLayout: true, subcategoryId })).toEqual(
      {
        label: 'Reco Club',
        variant: TagVariant.BOOKCLUB,
      }
    )
  })

  it('should return "Bientôt dispo" tag when isComingSoonOffer is true', () => {
    expect(getTagProps({ theme, isComingSoonOffer: true, subcategoryId })).toEqual({
      label: 'Bientôt dispo',
      variant: TagVariant.COMINGSOON,
    })
  })

  it('should use short label when coming soon and hasSmallLayout', () => {
    expect(
      getTagProps({ theme, isComingSoonOffer: true, hasSmallLayout: true, subcategoryId })
    ).toEqual({
      label: 'Bientôt',
      variant: TagVariant.COMINGSOON,
    })
  })

  it('should return "Reco du Ciné Club" tag when chroniclesCount > 0 and subcategory is not a Book Club', () => {
    expect(
      getTagProps({
        theme,
        chroniclesCount: 1,
        subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      })
    ).toEqual({
      label: 'Reco du Ciné Club',
      variant: TagVariant.CINECLUB,
    })
  })

  it('should return short label "Reco Club" when chroniclesCount > 0, hasSmallLayout is true, and not a Book Club', () => {
    expect(
      getTagProps({
        theme,
        chroniclesCount: 1,
        hasSmallLayout: true,
        subcategoryId: SubcategoryIdEnum.CINE_PLEIN_AIR,
      })
    ).toEqual({
      label: 'Reco Club',
      variant: TagVariant.CINECLUB,
    })
  })
})

describe('<InteractionTag />', () => {
  it('should have correct testID and style', () => {
    const tag = renderInteractionTag({ theme, likesCount: 1, subcategoryId })

    if (tag) render(tag)

    expect(screen.getByTestId('interaction-tag')).toHaveStyle({
      backgroundColor: theme.designSystem.color.background.subtle,
    })
  })
})
