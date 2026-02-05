import { theme } from 'theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { isBackgroundColorKey } from 'ui/theme/isBackgroundColorKey'

describe('isBackgroundColorKey', () => {
  it('returns true for design system background keys', () => {
    const background = theme.designSystem.color.background

    expect(isBackgroundColorKey('decorative01', background)).toBe(true)
    expect(isBackgroundColorKey('default', background)).toBe(true)
  })

  it('returns false for legacy ColorsEnum values', () => {
    const background = theme.designSystem.color.background

    expect(isBackgroundColorKey(ColorsEnum.AQUAMARINE_LIGHT, background)).toBe(false)
  })
})
