import { RouteParams, AllNavParamList } from 'features/navigation/RootNavigator'

export interface DeeplinkParts {
  routeName: string
  params: Record<string, string>
}

export interface DeeplinkEvent {
  url: string
}

type SerializedParams = Record<string, string>

export type ScreenConfiguration<ScreenName extends keyof AllNavParamList> = {
  screen: ScreenName
  params: RouteParams<AllNavParamList, ScreenName>
}

export type AllowedDeeplinkRoutes = keyof DeepLinksToScreenConfiguration

export type DeepLinksToScreenConfiguration = {
  default: (params?: SerializedParams) => ScreenConfiguration<'TabNavigator'>
  favoris: (params?: SerializedParams) => ScreenConfiguration<'Favorites'>
  login: (params?: SerializedParams) => ScreenConfiguration<'Login'>
  'set-email': (params?: SerializedParams) => ScreenConfiguration<'SetEmail'>
  'mot-de-passe-perdu': (
    params?: SerializedParams
  ) =>
    | ScreenConfiguration<'ReinitializePassword'>
    | ScreenConfiguration<'ResetPasswordExpiredLink'>
    | ScreenConfiguration<'TabNavigator'>
  offer: (params?: SerializedParams) => ScreenConfiguration<'Offer'>
  profil: (params?: SerializedParams) => ScreenConfiguration<'Profile'>
  recherche: (params?: SerializedParams) => ScreenConfiguration<'Search'>
  'signup-confirmation': (
    params?: SerializedParams
  ) => ScreenConfiguration<'AfterSignupEmailValidationBuffer'> | ScreenConfiguration<'TabNavigator'>
}
