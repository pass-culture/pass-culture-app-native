import { IdCheckRoute, IdCheckRootStackParamList } from '@pass-culture/id-check'
import { LinkingOptions, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { ComponentType } from 'react'
import { CountryCode } from 'react-native-country-picker-modal'

import { BeneficiaryValidationStep } from 'api/gen'

import { TabParamList, TabRouteName } from '../TabBar/types'

export type Referrals = Lowercase<keyof AllNavParamList> | 'deeplink'

/**
 * WARNING !
 * Deeplink: When updating the screen parameters, pay attention to the deeplink handlers.
 * If a deeplink handler indexes the screen with params you are changing,
 * please update the deeplink handler in consequence.
 */
export type RootStackParamList = {
  ABTestingPOC: undefined
  AcceptCgu: {
    email: string
    isNewsletterChecked: boolean
    password: string
    birthday: string
    postalCode: string | undefined
  }
  AccountCreated: undefined
  AfterSignupEmailValidationBuffer: { token: string; expirationTimestamp: number; email: string }
  AppComponents: undefined
  ChangePassword: undefined
  CheatCodes: undefined
  CheatMenu: undefined
  ConfirmDeleteProfile: undefined
  BookingConfirmation: { offerId: number; bookingId: number }
  BookingDetails: { id: number }
  BeneficiaryRequestSent: undefined
  ConsentSettings: { onGoBack?: () => void } | undefined
  CulturalSurvey: undefined
  DeeplinkImporter: undefined
  DeleteProfileSuccess: undefined
  EndedBookings: undefined
  ForgottenPassword: undefined
  FavoritesSorts: undefined
  IdCheck: { email: string; licence_token?: string; expiration_timestamp?: number | null }
  IdCheckUnavailable: undefined
  IdCheckTooManyAttempts: undefined
  Login:
    | {
        preventCancellation?: boolean
        follow?: {
          screen: 'NextBeneficiaryStep'
          params?: RootStackParamList['NextBeneficiaryStep']
        }
      }
    | undefined
  Maintenance: undefined
  Navigation: undefined
  NavigationIdCheckErrors: undefined
  NotificationSettings: undefined
  Offer: {
    id: number
    from: Referrals
    moduleName?: string
  }
  OfferDescription: { id: number }
  ReinitializePassword: { token: string; expiration_timestamp: number }
  ResetPasswordEmailSent: { email: string }
  ResetPasswordExpiredLink: { email: string }
  LegalNotices: undefined
  LocationFilter: undefined
  LocationPicker: undefined
  NextBeneficiaryStep: undefined
  Profile: undefined
  PersonalData: undefined
  SearchCategories: undefined
  SearchFilter: undefined
  SetBirthday: { email: string; isNewsletterChecked: boolean; password: string }
  SetEmail: { preventCancellation?: boolean } | undefined
  SetPassword: { email: string; isNewsletterChecked: boolean }
  SetPostalCode: { email: string; isNewsletterChecked: boolean; password: string; birthday: string }
  SignupConfirmationEmailSent: { email: string }
  SignupConfirmationExpiredLink: { email: string }
  TabNavigator: {
    screen: TabRouteName
    params: TabParamList[TabRouteName]
  }
  SetPhoneNumber: undefined
  SetPhoneValidationCode: { phoneNumber: string; countryCode: CountryCode }
  PhoneValidationTooManyAttempts: undefined
  VerifyEligibility: { email: string; nextBeneficiaryValidationStep: BeneficiaryValidationStep }
  FirstTutorial: { shouldCloseAppOnBackAction: boolean }
  EighteenBirthday: undefined
  ForceUpdate: undefined
} & IdCheckRootStackParamList

export type AllNavParamList = RootStackParamList & TabParamList

/** Type helper to share screen names */
export type ScreenNames = keyof AllNavParamList

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
 * Type helper for useNavigation in the context of a Stack Navigator
 * Cf. https://reactnavigation.org/docs/navigation-prop/#navigator-dependent-functions
 *
 * const navigation = useNavigation<UseNavigationType>()
 */
export type UseNavigationType = StackNavigationProp<AllNavParamList>
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
export interface Route extends IdCheckRoute<StackNavigationOptions, RootStackParamList> {
  hoc?(component: ComponentType<any>): ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  linking?: Partial<LinkingOptions>
}
