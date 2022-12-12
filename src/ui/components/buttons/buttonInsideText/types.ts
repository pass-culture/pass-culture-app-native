import { FunctionComponent } from 'react'
import { AccessibilityRole } from 'react-native'

import { AppButtonEventNative, AppButtonEventWeb } from 'ui/components/buttons/AppButton/types'
import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export type ButtonInsideTexteProps = {
  wording: string
  typography?: 'ButtonText' | 'Caption'
  icon?: FunctionComponent<IconInterface>
  buttonColor?: ColorsEnum
  onLongPress?: AppButtonEventWeb | AppButtonEventNative
  onPress?: AppButtonEventWeb | AppButtonEventNative
  accessibilityRole?: AccessibilityRole
  href?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
  testID?: string
}
