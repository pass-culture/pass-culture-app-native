import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorsType } from 'theme/types'
import { AppButtonEventNative, AppButtonEventWeb } from 'ui/components/buttons/AppButton/types'

export type LinkInsideTextProps = {
  wording: string
  accessibilityLabel?: string
  typography?: 'Button' | 'BodyAccentXs'
  color?: ColorsType
  onLongPress?: AppButtonEventWeb | AppButtonEventNative
  onPress?: AppButtonEventWeb | AppButtonEventNative
  type?: AccessibilityRole.LINK | AccessibilityRole.BUTTON
  href?: string
  target?: string
}
