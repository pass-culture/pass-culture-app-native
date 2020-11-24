import { RouteProp, NavigationProp } from '@react-navigation/native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import { Home } from 'features/home/pages/Home'
import { navigationRef } from 'features/navigation/RootNavigator'

// Comming next: remove this navigator
export type HomeStackParamList = {
  Home: { shouldDisplayLoginModal: boolean }
}

export const HomeStack = createStackNavigator<HomeStackParamList>()

export const HomeNavigator: React.FC = function () {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={Home}
        initialParams={{ shouldDisplayLoginModal: false }}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  )
}

// Comming next: move these helpers to RootNavigator

/** Type helper to share screen names */
export type ScreenNames = keyof HomeStackParamList
/**
 * Type helper for useRoute
 *
 * const {
 *  params: { token, expiration_timestamp },
 * } = useRoute<UseRouteType<'ReinitializePassword'>>()
 */
export type UseRouteType<ScreenName extends ScreenNames> = RouteProp<HomeStackParamList, ScreenName>
/**
 * Type helper for navigation prop
 *
 * type Props = {
 *   navigation: ScreenNavigationProp<'Home'>
 * }
 */
export type ScreenNavigationProp<ScreenName extends ScreenNames> = StackNavigationProp<
  HomeStackParamList,
  ScreenName
>
/**
 * Type helper for useNavigation
 *
 * const navigation = useNavigation<UseNavigationType>()
 */
export type UseNavigationType = NavigationProp<HomeStackParamList>
/**
 * Type helper to access route params
 *
 * export type MyStackParamList = {
 *   Login?: { userId: string }
 * }
 *
 * RouteParams<'Login', MyStackParamList>  // will return ({ userId: string } | undefined)
 */
export type RouteParams<
  StackParamList extends Record<string, unknown>,
  Screename extends keyof StackParamList
> = Pick<StackParamList, Screename>[Screename]

export function navigateToHomeWithoutModal() {
  if (navigationRef.current) {
    const navigation = (navigationRef.current as unknown) as StackNavigationProp<
      HomeStackParamList,
      'Home'
    >
    navigation.navigate('Home', { shouldDisplayLoginModal: false })
  }
}
