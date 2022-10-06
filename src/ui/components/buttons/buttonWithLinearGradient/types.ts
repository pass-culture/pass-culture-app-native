import { FunctionComponent } from 'react'
import { AccessibilityRole } from 'react-native'
import { DefaultTheme } from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'

export interface ButtonWithLinearGradientProps {
  children?: never
  wording: string
  onPress?: (() => void) | (() => Promise<void>)
  isDisabled?: boolean
  type?: 'button' | 'reset' | 'submit'
  className?: string
  name?: string
  icon?: FunctionComponent<IconInterface>
  accessibilityRole?: AccessibilityRole
  href?: string
  target?: string
  testID?: string
  fitContentWidth?: boolean
}

export type GenericStyleProps = {
  theme: DefaultTheme
  fitContentWidth: boolean
}
