import { AllNavParamList } from 'features/navigation/RootNavigator'
import { To } from 'ui/web/link/types'

export interface ButtonWithLinearGradientProps {
  children?: never
  wording: string
  onPress: (() => void) | (() => Promise<void>) | undefined
  isDisabled?: boolean
  isExternal?: boolean
  type?: 'button' | 'reset' | 'submit'
  className?: string
  name?: string
  to?: To<AllNavParamList, keyof AllNavParamList>
  externalHref?: string
}
