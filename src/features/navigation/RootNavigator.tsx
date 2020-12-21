import { NavigationContainer, NavigationProp, RouteProp, Theme } from '@react-navigation/native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect } from 'react'

import { ForgottenPassword } from 'features/auth/forgottenPassword/ForgottenPassword'
import { ReinitializePassword } from 'features/auth/forgottenPassword/ReinitializePassword'
import { ResetPasswordEmailSent } from 'features/auth/forgottenPassword/ResetPasswordEmailSent'
import { ResetPasswordExpiredLink } from 'features/auth/forgottenPassword/ResetPasswordExpiredLink'
import { Login } from 'features/auth/login/Login'
import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AfterSignupEmailValidationBuffer } from 'features/auth/signup/AfterSignupEmailValidationBuffer'
import { SetBirthday } from 'features/auth/signup/SetBirthday'
import { SetEmail } from 'features/auth/signup/SetEmail'
import { SetPassword } from 'features/auth/signup/SetPassword'
import { SignupConfirmationEmailSent } from 'features/auth/signup/SignupConfirmationEmailSent'
import { SignupConfirmationExpiredLink } from 'features/auth/signup/SignupConfirmationExpiredLink'
import { AppComponents } from 'features/cheatcodes/pages/AppComponents'
import { CheatCodes } from 'features/cheatcodes/pages/CheatCodes'
import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { Offer, OfferDescription } from 'features/offer'
import { logScreenView } from 'libs/analytics'
import { ColorsEnum } from 'ui/theme'

import { navigationRef } from './navigationRef'
import { onNavigationStateChange } from './services'
import { TabNavigator, TabParamList } from './TabBar/TabNavigator'

/**
 * WARNING !
 * Deeplink: When updating the screen parameters, pay attention to the deeplink handlers.
 * If a deeplink handler indexes the screen with params you are changing,
 * please update the deeplink handler in consequence.
 */
export type RootStackParamList = {
  AcceptCgu: {
    email: string
    isNewsletterChecked: boolean
    password: string
    birthday: string
  }
  AfterSignupEmailValidationBuffer: { token: string; expirationTimestamp: number; email: string }
  AppComponents: undefined
  CheatCodes: undefined
  ForgottenPassword: undefined
  Login: undefined
  IdCheck: { email: string; licenceToken: string }
  Navigation: undefined
  Offer: { id: number }
  OfferDescription: { id: number }
  ReinitializePassword: { token: string; expiration_timestamp: number }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  SetBirthday: { email: string; isNewsletterChecked: boolean; password: string }
  SetEmail: undefined
  SetPassword: { email: string; isNewsletterChecked: boolean }
  SignupConfirmationEmailSent: { email: string }
  SignupConfirmationExpiredLink: { email: string }
  TabNavigator: undefined
}

export const RootStack = createStackNavigator<RootStackParamList>()

const theme = { colors: { background: ColorsEnum.WHITE } } as Theme

export const RootNavigator: React.FC = () => {
  useEffect(() => {
    logScreenView('Home')
  }, [])
  return (
    <NavigationContainer onStateChange={onNavigationStateChange} ref={navigationRef} theme={theme}>
      <RootStack.Navigator
        initialRouteName="TabNavigator"
        headerMode="screen"
        screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="TabNavigator" component={TabNavigator} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Offer" component={Offer} />
        <RootStack.Screen name="OfferDescription" component={OfferDescription} />
        <RootStack.Screen name="ReinitializePassword" component={ReinitializePassword} />
        <RootStack.Screen name="IdCheck" component={IdCheck} />
        <RootStack.Screen name="AppComponents" component={AppComponents} />
        <RootStack.Screen name="Navigation" component={Navigation} />
        <RootStack.Screen name="CheatCodes" component={CheatCodes} />
        <RootStack.Screen name="ResetPasswordEmailSent" component={ResetPasswordEmailSent} />
        <RootStack.Screen name="ForgottenPassword" component={ForgottenPassword} />
        <RootStack.Screen name="SetEmail" component={SetEmail} />
        <RootStack.Screen name="SetPassword" component={SetPassword} />
        <RootStack.Screen name="SetBirthday" component={SetBirthday} />
        <RootStack.Screen name="AcceptCgu" component={AcceptCgu} />
        <RootStack.Screen
          name="AfterSignupEmailValidationBuffer"
          component={AfterSignupEmailValidationBuffer}
        />
        <RootStack.Screen name="ResetPasswordExpiredLink" component={ResetPasswordExpiredLink} />
        <RootStack.Screen
          name="SignupConfirmationEmailSent"
          component={SignupConfirmationEmailSent}
        />
        <RootStack.Screen
          name="SignupConfirmationExpiredLink"
          component={SignupConfirmationExpiredLink}
        />
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
