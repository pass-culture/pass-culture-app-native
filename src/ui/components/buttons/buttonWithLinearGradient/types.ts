import { FunctionComponent } from 'react'
import { AccessibilityRole, GestureResponderEvent } from 'react-native'

import { AccessibleIcon } from 'ui/svg/icons/types'

export interface ButtonWithLinearGradientDeprecatedPropsProps {
  children?: never
  wording: string
  onPress?: (event: GestureResponderEvent | MouseEvent) => void | Promise<void>
  isDisabled?: boolean
  type?: 'button' | 'reset' | 'submit'
  className?: string
  name?: string
  icon?: FunctionComponent<AccessibleIcon>
  accessibilityRole?: AccessibilityRole
  href?: string
  target?: string
  testID?: string
  fitContentWidth?: boolean
  iconAfterWording?: boolean
}
