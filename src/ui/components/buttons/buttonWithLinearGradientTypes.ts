import { FunctionComponent } from 'react'

import { IconInterface } from 'ui/svg/icons/types'

export interface ButtonWithLinearGradientProps {
  children?: never
  wording: string
  onPress: (() => void) | (() => Promise<void>) | undefined
  isDisabled?: boolean
  type?: 'button' | 'reset' | 'submit'
  className?: string
  name?: string
  to?: string
  externalHref?: string
  icon?: FunctionComponent<IconInterface>
  testID?: string
}
