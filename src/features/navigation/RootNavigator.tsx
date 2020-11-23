import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationProp,
  RouteProp,
} from '@react-navigation/native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import { ChoosePassword } from 'features/auth/pages/ChoosePassword'
import { ForgottenPassword } from 'features/auth/pages/ForgottenPassword'
import { Login } from 'features/auth/pages/Login'
import { ReinitializePassword } from 'features/auth/pages/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/pages/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/pages/ResetPasswordExpiredLink'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { Offer } from 'features/offer'

import { onNavigationStateChange } from './services'
import { TabNavigator, TabParamList } from './TabBar/TabNavigator'

export type RootStackParamList = {
  TabNavigator: undefined
  Login: undefined
  Offer: { offerId: string }
  ReinitializePassword: { token: string; expiration_timestamp: number }
  IdCheck: undefined
  AppComponents: undefined
  Navigation: undefined
  CheatCodes: undefined
  ResetPasswordEmailSent: { email: string }
  ForgottenPassword: undefined
  ResetPasswordExpiredLink: { email: string }
  ChoosePassword: undefined
}

export const RootStack = createStackNavigator<RootStackParamList>()
export const navigationRef = React.createRef<NavigationContainerRef>()

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef}>
      <RootStack.Navigator initialRouteName="TabNavigator" screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="TabNavigator" component={TabNavigator} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Offer" component={Offer} options={{ headerShown: true }} />
        <RootStack.Screen name="ReinitializePassword" component={ReinitializePassword} />
        <RootStack.Screen name="IdCheck" component={IdCheck} />
        <RootStack.Screen name="AppComponents" component={AppComponents} />
        <RootStack.Screen name="Navigation" component={Navigation} />
        <RootStack.Screen name="CheatCodes" component={CheatCodes} />
        <RootStack.Screen name="ResetPasswordEmailSent" component={ResetPasswordEmailSent} />
        <RootStack.Screen name="ForgottenPassword" component={ForgottenPassword} />
        <RootStack.Screen name="ResetPasswordExpiredLink" component={ResetPasswordExpiredLink} />
        <RootStack.Screen name="ChoosePassword" component={ChoosePassword} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export type AllNavParamList = RootStackParamList & TabParamList

/** Type helper to share screen names */
type ScreenNames = keyof AllNavParamList
/**
 * Type helper for useRoute
 *
 * const {
 *  params: { token, expiration_timestamp },
 * } = useRoute<UseRouteType<'ReinitializePassword'>>()
 */
export type UseRouteType<ScreenName extends ScreenNames> = RouteProp<AllNavParamList, ScreenName>
/**
 * Type helper for navigation prop
 *
 * type Props = {
 *   navigation: ScreenNavigationProp<'Home'>
 * }
 */
export type ScreenNavigationProp<ScreenName extends ScreenNames> = StackNavigationProp<
  AllNavParamList,
  ScreenName
>
/**
 * Type helper for useNavigation
 *
 * const navigation = useNavigation<UseNavigationType>()
 */
export type UseNavigationType = NavigationProp<AllNavParamList>
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
      AllNavParamList,
      'Home'
    >
    navigation.navigate('Home', { shouldDisplayLoginModal: false })
  }
}
