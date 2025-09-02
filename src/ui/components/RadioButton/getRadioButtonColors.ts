import { DefaultTheme } from 'styled-components/native'

import { SelectableVariant } from 'ui/components/inputs/types'
import { RadioButtonState } from 'ui/components/RadioButton/RadioButton'

const getBorderColor = (state: RadioButtonState, color: DefaultTheme['designSystem']['color']) => {
  switch (true) {
    case state.disabled:
      return color.border.disabled
    case state.error:
      return color.border.error
    case state.selected:
      return color.border.brandPrimary
    default:
      return color.border.default
  }
}

type RadioButtonParams = {
  state: RadioButtonState
  variant: SelectableVariant
  collapsed: boolean
  componentType?: 'container' | 'round' | 'circle'
}

type GetBackgroundColorParams = RadioButtonParams & {
  color: DefaultTheme['designSystem']['color']
}

const getBackgroundColor = ({
  state,
  variant,
  collapsed,
  color,
  componentType,
}: GetBackgroundColorParams) => {
  const isRoundOfSelection = componentType === 'round'

  if (state.disabled) {
    if (state.selected && isRoundOfSelection) return color.icon.disabled
    if (variant === 'detailed' || state.selected) return color.background.disabled
    return color.background.default
  }
  if (state.error) return color.background.default
  if (state.selected) {
    if (collapsed) return color.background.default
    if (isRoundOfSelection) return color.background.brandPrimary
    if (componentType === 'container') return color.background.brandPrimarySelected
    if (componentType === 'circle' && variant === 'detailed')
      return color.background.brandPrimarySelected
  }
  return color.background.default
}

type GetColorsParams = RadioButtonParams & {
  theme: DefaultTheme
}

export const getRadioButtonColors = ({
  state,
  variant,
  collapsed,
  theme,
  componentType,
}: GetColorsParams) => {
  const { color } = theme.designSystem

  return {
    borderColor: getBorderColor(state, color),
    backgroundColor: getBackgroundColor({
      state,
      variant,
      collapsed,
      color,
      componentType,
    }),
  }
}
