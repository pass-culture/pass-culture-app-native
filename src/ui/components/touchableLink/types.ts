import { ElementType } from 'react'
import { TouchableOpacityProps } from 'react-native'

import { UrlParamsProps } from 'features/navigation/helpers'
import { RootNavigateParams } from 'features/navigation/RootNavigator'

export type TouchableLinkProps<T = ElementType> = {
  navigateTo?: {
    screen: RootNavigateParams[0]
    params?: RootNavigateParams[1]
    fromRef?: boolean
    withPush?: boolean
  }
  externalNav?: {
    url: string
    params?: UrlParamsProps
    address?: string
    onSuccess?: () => void | Promise<void>
    onError?: () => void
  }
  navigateBeforeOnPress?: boolean
  highlight?: boolean
  as?: T
  isOnPressDebounced?: boolean
} & TouchableOpacityProps
