import { NavigationContainer, NavigationProp, RouteProp } from '@react-navigation/native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import { Login } from 'features/auth/pages/Login'
import { ReinitializePassword } from 'features/auth/pages/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/pages/ResetPasswordEmailSent'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { Home } from 'features/home/pages/Home'

import { onNavigationStateChange } from './services'

export type RootStackParamList = {
  AppComponents: undefined
  Navigation: undefined
  CheatCodes: undefined
  Home: { shouldDisplayLoginModal: boolean }
  IdCheck: undefined
  Login?: { userId: string }
  ReinitializePassword: { token: string; expiration_date: number }
  ResetPasswordEmailSent: { userEmail: string }
}

export const RootStack = createStackNavigator<RootStackParamList>()

export const RootNavigator: React.FC = function () {
  return (
    <NavigationContainer onStateChange={onNavigationStateChange}>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen
          name="Home"
          component={Home}
          initialParams={{ shouldDisplayLoginModal: false }}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <RootStack.Screen
          name="ReinitializePassword"
          component={ReinitializePassword}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="IdCheck" component={IdCheck} options={{ headerShown: false }} />
        <RootStack.Screen
          name="AppComponents"
          component={AppComponents}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Navigation"
          component={Navigation}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="CheatCodes"
          component={CheatCodes}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="ResetPasswordEmailSent" component={ResetPasswordEmailSent} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

/** Type helper to share screen names */
export type ScreenNames = keyof RootStackParamList
/**
 * Type helper for useRoute
 *
 * const {
 *  params: { token, expiration_date },
 * } = useRoute<UseRouteType<'ReinitializePassword'>>()
 */
export type UseRouteType<ScreenName extends ScreenNames> = RouteProp<RootStackParamList, ScreenName>
/**
 * Type helper for navigation prop
 *
 * type Props = {
 *   navigation: ScreenNavigationProp<'Home'>
 * }
 */
export type ScreenNavigationProp<ScreenName extends ScreenNames> = StackNavigationProp<
  RootStackParamList,
  ScreenName
>
/**
 * Type helper for useNavigation
 *
 * const navigation = useNavigation<UseNavigationType>()
 */
export type UseNavigationType = NavigationProp<RootStackParamList>
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
