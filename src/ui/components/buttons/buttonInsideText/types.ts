import { FunctionComponent } from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType } from 'theme/types'
import { AppButtonEventNative, AppButtonEventWeb } from 'ui/components/buttons/AppButton/types'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type ButtonInsideTexteProps = {
  wording: string
  typography?: 'Button' | 'BodyAccentXs'
  icon?: FunctionComponent<AccessibleIcon>
  buttonColor?: ColorsType
  onLongPress?: AppButtonEventWeb | AppButtonEventNative
  onPress?: AppButtonEventWeb | AppButtonEventNative
  accessibilityRole?: AccessibilityRole
  href?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
  testID?: string
  accessibilityLabel?: string
}

export type ButtonInsideTextV2Props = {
  wording: string
  accessibilityLabel?: string
  typography?: 'Button' | 'BodyAccentXs'
  onLongPress?: AppButtonEventWeb | AppButtonEventNative
  onPress?: AppButtonEventWeb | AppButtonEventNative
  type?: AccessibilityRole.LINK | AccessibilityRole.BUTTON
}
