import { FunctionComponent } from 'react'

import { AllNavParamList } from 'features/navigation/RootNavigator'
import { AppButtonEventNative, AppButtonEventWeb } from 'ui/components/buttons/AppButton/types'
import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { To } from 'ui/web/link/types'

export type ButtonInsideTexteProps = {
  wording: string
  typography?: 'ButtonText' | 'Caption'
  icon?: FunctionComponent<IconInterface>
  color?: ColorsEnum
  onLongPress?: AppButtonEventWeb | AppButtonEventNative
  onPress?: AppButtonEventWeb | AppButtonEventNative
  to?: To<AllNavParamList, keyof AllNavParamList>
  externalHref?: string
  type?: 'button' | 'submit' | 'reset'
}
