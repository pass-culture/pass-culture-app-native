import { NavigationProp, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { ComponentType } from 'react'

import { TabParamList } from '../TabBar/types'

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
  AccountCreated: undefined
  AfterSignupEmailValidationBuffer: { token: string; expirationTimestamp: number; email: string }
  AppComponents: undefined
  CheatCodes: undefined
  CheatMenu: undefined
  CulturalSurvey: undefined
  EligibilityConfirmed: undefined
  ForgottenPassword: undefined
  IdCheck: { email: string; licenceToken: string }
  Login: ({ preventCancellation?: boolean } & BackNavigationParams<'Home'>) | undefined
  Navigation: undefined
  NotificationSettings: undefined
  Offer: { id: number }
  OfferDescription: { id: number }
  ReinitializePassword: { token: string; expiration_timestamp: number }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  LegalNotices: undefined
  LocationFilter: undefined
  LocationPicker: undefined
  Profile: undefined
  SearchCategories: undefined
  SearchFilter: undefined
  SetBirthday: { email: string; isNewsletterChecked: boolean; password: string }
  SetEmail: ({ preventCancellation?: boolean } & BackNavigationParams<'Home'>) | undefined
  SetPassword: { email: string; isNewsletterChecked: boolean }
  SignupConfirmationEmailSent: { email: string }
  SignupConfirmationExpiredLink: { email: string }
  TabNavigator: undefined
  TemporaryProfilePage: undefined
  VerifyEligibility: { email: string; licenceToken: string }
  FirstTutorial: undefined
  EighteenBirthday: undefined
}

export type AllNavParamList = RootStackParamList & TabParamList

/** Type helper to share screen names */
export type ScreenNames = keyof AllNavParamList

/**
 * RootStackParamList = {
 *  // understand: can navigate from Login or Home to SetEmail
 *  SetEmail: BackNavigationParams<'Login'> | BackNavigationParams<'Home'> | undefined
 * }
 */
export type BackNavigationParams<ScreenName extends ScreenNames> = {
  backNavigation?: {
    from: ScreenName
    params: AllNavParamList[ScreenName]
  }
}

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

/**
 * Type helper to declare a route
 */
export interface Route {
  name: keyof RootStackParamList
  component: ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  hoc?(component: ComponentType<any>): ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: StackNavigationOptions
}
