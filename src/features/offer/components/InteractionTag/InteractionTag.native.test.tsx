import {
  getTagProps,
  renderInteractionTag,
} from 'features/offer/components/InteractionTag/InteractionTag'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'
import { getSpacing } from 'ui/theme'

describe('getTagProps', () => {
  it('should return null if no parameters are provided', () => {
    expect(getTagProps({ theme })).toEqual(null)
  })

  it('should return the "Reco du Club" tag if chroniclesCount > 0', () => {
    expect(getTagProps({ theme, chroniclesCount: 1, headlinesCount: 10, likesCount: 10 })).toEqual({
      label: 'Reco du Club',
      backgroundColor: theme.designSystem.color.background.bookclub,
      Icon: expect.anything(),
    })
  })

  it('should return the "Reco par les lieux" tag if chroniclesCount is 0 and headlinesCount > 0', () => {
    expect(getTagProps({ theme, headlinesCount: 1, likesCount: 10 })).toEqual({
      label: 'Reco par les lieux',
      backgroundColor: theme.designSystem.color.background.headline,
      Icon: expect.anything(),
    })
  })

  it('should return the "j’aime" tag if chroniclesCount and headlinesCount are 0 and likesCount > 0', () => {
    expect(getTagProps({ theme, likesCount: 1 })).toEqual({
      label: '1 j’aime',
      backgroundColor: theme.designSystem.color.background.subtle,
      Icon: expect.anything(),
    })
  })

  it('should return null if likesCount, headlinesCount and chroniclesCount are not > 0', () => {
    expect(getTagProps({ theme })).toBeNull()
  })

  it('should use short label when hasSmallLayout is true "Reco lieux"', () => {
    expect(getTagProps({ theme, headlinesCount: 1, hasSmallLayout: true })).toEqual({
      label: 'Reco lieux',
      backgroundColor: theme.designSystem.color.background.headline,
      Icon: expect.anything(),
    })
  })

  it('should use short label when hasSmallLayout is true "Reco Club"', () => {
    expect(getTagProps({ theme, chroniclesCount: 1, hasSmallLayout: true })).toEqual({
      label: 'Reco Club',
      backgroundColor: theme.designSystem.color.background.bookclub,
      Icon: expect.anything(),
    })
  })

  it('should return the "Bientôt dispo" tag if isComingSoonOffer is true', () => {
    expect(getTagProps({ theme, isComingSoonOffer: true })).toEqual({
      label: 'Bientôt dispo',
      backgroundColor: theme.designSystem.color.background.warning,
      Icon: expect.anything(),
    })
  })
})

describe('<InteractionTag />', () => {
  it('should have correct testID and style', () => {
    const tag = renderInteractionTag({ theme, likesCount: 1 })

    if (tag) render(tag)

    expect(screen.getByTestId('interaction-tag')).toHaveStyle({
      backgroundColor: theme.designSystem.color.background.subtle,
      paddingHorizontal: getSpacing(1),
    })
  })
})
