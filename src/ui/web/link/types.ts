/**
 * Ce fichier contient les types copier de @react-navigation/native Link
 *
 * Related issues :
 * - https://github.com/react-navigation/react-navigation/issues/10295
 * - https://github.com/necolas/react-native-web/issues/2206
 */
import { NavigationAction } from '@react-navigation/core'
import React from 'react'
import { GestureResponderEvent, TextProps, TouchableOpacityProps } from 'react-native'

import { AllNavParamList } from 'features/navigation/RootNavigator'

export type To<
  ParamList extends ReactNavigation.RootParamList = ReactNavigation.RootParamList,
  RouteName extends keyof ParamList = keyof ParamList
> =
  | string
  | (undefined extends ParamList[RouteName]
      ? {
          screen: Extract<RouteName, string>
          params?: ParamList[RouteName]
        }
      : {
          screen: Extract<RouteName, string>
          params: ParamList[RouteName]
        })

export type Props<ParamList extends ReactNavigation.RootParamList> = {
  to: To<ParamList>
  action?: NavigationAction
  target?: string
  onPress?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => void
} & (TextProps & { children: React.ReactNode })

export type AProps = {
  children: React.ReactNode
  href?: string
  className?: string
  accessible?: boolean
}

export type TouchableLinkProps = {
  to?: To<AllNavParamList, keyof AllNavParamList>
  externalHref?: string
  highlight?: boolean
} & TouchableOpacityProps

export type QuickAccessProps = {
  href: string
  title: string
}
