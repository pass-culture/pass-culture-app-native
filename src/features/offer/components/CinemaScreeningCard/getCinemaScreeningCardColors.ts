import { DefaultTheme } from 'styled-components/native'

import { CinemaScreeningCardColorKeys, CinemaScreeningCardState } from './types'

const colorKeysByState: Record<CinemaScreeningCardState, CinemaScreeningCardColorKeys> = {
  default: {
    background: 'default',
    border: 'default',
    title: 'default',
    subtitle: 'subtle',
    price: 'default',
    icon: 'brandPrimary',
  },
  hover: {
    background: 'hover',
    border: 'brandPrimaryHover',
    title: 'brandPrimaryHover',
    subtitle: 'brandPrimaryHover',
    price: 'brandPrimaryHover',
    icon: 'brandPrimaryHover',
  },
  disabled: {
    background: 'disabled',
    border: 'default',
    title: 'default',
    subtitle: 'subtle',
    price: 'default',
    icon: 'brandPrimary',
  },
}

const getCinemaScreeningCardState = ({
  disabled,
  hovered,
}: {
  disabled: boolean
  hovered: boolean
}): CinemaScreeningCardState => {
  if (disabled) return 'disabled'
  if (hovered) return 'hover'
  return 'default'
}

export const getCinemaScreeningCardColors = ({
  disabled,
  hovered,
  theme,
}: {
  disabled: boolean
  hovered: boolean
  theme: DefaultTheme
}) => {
  const state = getCinemaScreeningCardState({ disabled, hovered })
  const keys = colorKeysByState[state]
  const { background, border, icon, text } = theme.designSystem.color

  return {
    backgroundColor: background[keys.background],
    borderColor: border[keys.border],
    titleColor: text[keys.title],
    subtitleColor: text[keys.subtitle],
    priceColor: text[keys.price],
    iconColor: icon[keys.icon],
  }
}
