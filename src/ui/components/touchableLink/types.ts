import { ElementType } from 'react'
import { GestureResponderEvent, TouchableOpacityProps } from 'react-native'

import { UrlParamsProps } from 'features/navigation/helpers'
import { RootNavigateParams } from 'features/navigation/RootNavigator/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export type InternalNavigationProps = {
  enableNavigate?: boolean // It is used by offline mode to prevent navigation
  navigateTo: {
    screen: RootNavigateParams[0]
    params?: RootNavigateParams[1]
    withPush?: boolean // If true, uses push instead of navigate
    fromRef?: boolean // If true, uses navigateFromRef/pushFromRef instead of navigate/push
  }
  externalNav?: never
}

export type ExternalNavigationProps = {
  externalNav: {
    url: string
    params?: UrlParamsProps
    address?: string // If provided, navigates using useItinerary hook
    onSuccess?: () => void | Promise<void>
    onError?: () => void
  }
  enableNavigate?: never
  navigateTo?: never
}

export type InternalOrExternalNavigationProps = InternalNavigationProps | ExternalNavigationProps

type AsProps = {
  as?: ElementType // Component that will be used to render the link
} & Record<string, unknown>

type TouchableLinkGenericProps = {
  onBeforeNavigate?: (event: GestureResponderEvent) => void
  onAfterNavigate?: (event: GestureResponderEvent) => void
  highlight?: boolean // If true, uses TouchableHighlight instead of TouchableOpacity to render component
  hoverUnderlineColor?: ColorsEnum // Color to be used for underline effect on hover. Black if not specified
  isOnPressDebounced?: boolean
} & Omit<TouchableOpacityProps, 'onPress'> &
  AsProps

export type ExternalTouchableLinkProps = TouchableLinkGenericProps & ExternalNavigationProps

export type InternalTouchableLinkProps = TouchableLinkGenericProps & InternalNavigationProps

export type TouchableLink2Props = TouchableLinkGenericProps & {
  handleNavigation: () => void
  linkProps?:
    | {
        href: string
        accessibilityRole: 'link'
        onPress: () => void
      }
    | {
        href: string
        target: string
      }
}
