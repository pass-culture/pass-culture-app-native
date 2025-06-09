import { DefaultTheme } from 'styled-components/native'

import { CheckboxState, CheckboxVariant } from 'ui/components/inputs/Checkbox/types'

export const getCheckboxColors = (
  state: CheckboxState,
  variant: CheckboxVariant,
  collapsed: boolean,
  theme: DefaultTheme,
  options?: 'container' | 'mark'
) => {
  const { color } = theme.designSystem
  const isContainer = options === 'container'
  const isMark = options === 'mark'
  const isDetailed = variant === 'detailed'

  const getBorderColor = () => {
    switch (state) {
      case 'checked':
      case 'indeterminate':
        return color.border.brandPrimary
      case 'error':
        return color.border.error
      case 'disabled':
        return color.border.disabled
      default:
        return color.border.default
    }
  }

  const getBackgroundColor = () => {
    switch (state) {
      case 'checked':
      case 'indeterminate':
        if (collapsed) return color.background.default
        if (isContainer) return color.background.brandPrimarySelected
        if (isMark) return color.background.brandPrimary
        return color.background.default
      case 'disabled':
        if (isDetailed) return color.background.disabled
        return color.background.default
      case 'error':
      case 'default':
      default:
        return color.background.default
    }
  }

  return {
    borderColor: getBorderColor(),
    backgroundColor: getBackgroundColor(),
  }
}
