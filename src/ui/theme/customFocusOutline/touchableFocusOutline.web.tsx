// eslint-disable-next-line no-restricted-imports
import { isFirefox, isSafari } from 'react-device-detect'

import { TouchableFocusOutlineProps } from 'ui/theme/customFocusOutline/type'

const defaultFocus = { outlineOffset: '-1px' }
const firefoxFocus = { outlineOffset: '-2px' }
const safariFocus = { outlineOffset: '-3px' }

const focusStyle = () => {
  if (isFirefox) return firefoxFocus
  if (isSafari) return safariFocus
  return defaultFocus
}

export const touchableFocusOutline = ({ theme, isFocus }: TouchableFocusOutlineProps) =>
  isFocus ? { ...focusStyle(), outlineColor: theme.designSystem.color.outline.default } : {}
