import { DefaultTheme } from 'styled-components/native'

import { CheckboxState, CheckboxVariant } from 'ui/components/inputs/Checkbox/types'

const hasState = (state: CheckboxState[], target: CheckboxState) => state.includes(target)

const getBorderColor = (state: CheckboxState[], color: DefaultTheme['designSystem']['color']) => {
  if (hasState(state, 'disabled')) return color.border.disabled
  if (hasState(state, 'error')) return color.border.error
  if (hasState(state, 'checked') || hasState(state, 'indeterminate'))
    return color.border.brandPrimary
  return color.border.default
}

type CheckboxParams = {
  state: CheckboxState[]
  variant: CheckboxVariant
  collapsed: boolean
  componentType?: 'container' | 'mark'
}

type GetBackgroundColorParams = CheckboxParams & {
  color: DefaultTheme['designSystem']['color']
}

const getBackgroundColor = ({
  state,
  variant,
  collapsed,
  color,
  componentType,
}: GetBackgroundColorParams) => {
  const isContainer = componentType === 'container'
  const isMark = componentType === 'mark'
  const isDetailed = variant === 'detailed'

  if (hasState(state, 'disabled')) {
    if (isDetailed || hasState(state, 'checked') || hasState(state, 'indeterminate'))
      return color.background.disabled
    return color.background.default
  }
  if (hasState(state, 'error')) return color.background.default
  if (hasState(state, 'checked') || hasState(state, 'indeterminate')) {
    if (collapsed) return color.background.default
    if (isContainer) return color.background.brandPrimarySelected
    if (isMark) return color.background.brandPrimary
  }
  return color.background.default
}

type GetColorsParams = CheckboxParams & {
  theme: DefaultTheme
}

export const getCheckboxColors = ({
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
