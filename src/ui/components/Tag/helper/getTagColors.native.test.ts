import { DefaultTheme } from 'styled-components/native'

import { theme } from 'theme'
import { getTagColors } from 'ui/components/Tag/helper/getTagColors'
import { TagVariant } from 'ui/components/Tag/types'

describe('getTagColors', () => {
  const mockTheme: DefaultTheme = {
    ...theme,
    showTabBar: true,
    designSystem: {
      ...theme.designSystem,
    },
  }

  const { background, icon } = mockTheme.designSystem.color
  const iconSize = mockTheme.icons.sizes.extraSmall

  const getColors = (variant: TagVariant) =>
    getTagColors({
      variant,
      background,
      icon,
      theme: mockTheme,
    })

  it('should return correct colors for TagVariant.DEFAULT', () => {
    const result = getColors(TagVariant.DEFAULT)

    expect(result.backgroundColor).toEqual(background.subtle)
    expect(result.iconColor).toEqual(icon.default)
    expect(result.iconSize).toEqual(iconSize)
  })

  it('should return correct colors for TagVariant.NEW', () => {
    const result = getColors(TagVariant.NEW)

    expect(result.backgroundColor).toEqual(background.brandPrimary)
    expect(result.labelColor).toEqual('inverted')
  })

  it('should return correct colors for TagVariant.HEADLINE', () => {
    const result = getColors(TagVariant.HEADLINE)

    expect(result.backgroundColor).toEqual(background.headline)
    expect(result.iconColor).toEqual(icon.headline)
  })
})
