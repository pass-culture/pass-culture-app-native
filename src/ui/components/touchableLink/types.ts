import { ElementType } from 'react'
import { GestureResponderEvent, TouchableOpacityProps } from 'react-native'

import { UrlParamsProps } from 'features/navigation/helpers/openUrl'
import { RootNavigateParams } from 'features/navigation/navigators/RootNavigator/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsType } from 'theme/types'

export type InternalNavigationProps = {
  enableNavigate?: boolean // It is used by offline mode to prevent navigation
  navigateTo: {
    screen: RootNavigateParams[0]
    params?: RootNavigateParams[1]
    withPush?: boolean // If true, uses push instead of navigate
    withReset?: boolean // If true, use reset instead of navigate
    fromRef?: boolean // If true, uses navigateFromRef/pushFromRef instead of navigate/push
  }
  externalNav?: never
}

export type ExternalNavigationProps = {
  externalNav: {
    url: string
    params?: UrlParamsProps
    address?: string
    onSuccess?: () => void | Promise<void>
    onError?: () => void
  }
  openInNewWindow?: boolean
  enableNavigate?: never
  navigateTo?: never
}

export type InternalOrExternalNavigationProps = InternalNavigationProps | ExternalNavigationProps

type AsProps = {
  as?: ElementType // Component that will be used to render the link
} & Record<string, unknown>

type TouchableLinkGenericProps = {
  onBeforeNavigate?: (event: GestureResponderEvent | MouseEvent) => void | Promise<void>
  onAfterNavigate?: (event: GestureResponderEvent | MouseEvent) => void | Promise<void>
  highlight?: boolean // If true, uses TouchableHighlight instead of TouchableOpacity to render component
  hoverUnderlineColor?: ColorsType // Color to be used for underline effect on hover. Black if not specified
} & Omit<TouchableOpacityProps, 'onPress'> &
  AsProps

export type ExternalTouchableLinkProps = TouchableLinkGenericProps & ExternalNavigationProps

export type InternalTouchableLinkProps = TouchableLinkGenericProps & InternalNavigationProps

export type TouchableLinkProps = TouchableLinkGenericProps & {
  handleNavigation?: () => void
  linkProps?: {
    href?: string
    role?: 'link'
    accessibilityRole?: 'link'
    target?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPress?: (...args: any[]) => void
  }
}

export type HandleNavigationWrapperProps = Pick<
  TouchableLinkProps,
  'handleNavigation' | 'onBeforeNavigate' | 'onAfterNavigate'
>
