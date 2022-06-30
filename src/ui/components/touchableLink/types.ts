import { ElementType } from 'react'
import { TouchableOpacityProps } from 'react-native'

import { UrlParamsProps } from 'features/navigation/helpers'
import { RootNavigateParams } from 'features/navigation/RootNavigator'

export type InternalNavigationProps = {
  navigateTo: {
    screen: RootNavigateParams[0]
    params?: RootNavigateParams[1]
    fromRef?: boolean
    withPush?: boolean
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
  navigateTo?: never
}

export type InternalOrExternalNavigationProps = InternalNavigationProps | ExternalNavigationProps

type AsProps = {
  as?: ElementType // Component that will be used to render the link
} & Record<string, unknown>

export type TouchableLinkProps =
  | (InternalNavigationProps | ExternalNavigationProps) & {
      navigateBeforeOnPress?: boolean
      highlight?: boolean
      isOnPressDebounced?: boolean
    } & TouchableOpacityProps &
      AsProps
