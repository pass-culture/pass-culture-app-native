import { DefaultTheme } from 'styled-components/native'

import { theme } from 'theme'

import { getCinemaScreeningCardColors } from './getCinemaScreeningCardColors'

describe('getCinemaScreeningCardColors', () => {
  const getColors = (disabled: boolean, hovered: boolean) =>
    getCinemaScreeningCardColors({ disabled, hovered, theme: theme as DefaultTheme })

  it('should return default colors', () => {
    const colors = getColors(false, false)

    expect(colors).toEqual({
      backgroundColor: theme.designSystem.color.background.default,
      borderColor: theme.designSystem.color.border.default,
      titleColor: theme.designSystem.color.text.default,
      subtitleColor: theme.designSystem.color.text.subtle,
      priceColor: theme.designSystem.color.text.default,
      iconColor: theme.designSystem.color.icon.brandPrimary,
    })
  })

  it('should return hover colors', () => {
    const colors = getColors(false, true)

    expect(colors).toEqual({
      backgroundColor: theme.designSystem.color.background.hover,
      borderColor: theme.designSystem.color.border.brandPrimaryHover,
      titleColor: theme.designSystem.color.text.brandPrimaryHover,
      subtitleColor: theme.designSystem.color.text.brandPrimaryHover,
      priceColor: theme.designSystem.color.text.brandPrimaryHover,
      iconColor: theme.designSystem.color.icon.brandPrimaryHover,
    })
  })

  it('should prioritize disabled colors over hover colors', () => {
    const colors = getColors(true, true)

    expect(colors.backgroundColor).toEqual(theme.designSystem.color.background.disabled)
    expect(colors.titleColor).toEqual(theme.designSystem.color.text.default)
  })
})
