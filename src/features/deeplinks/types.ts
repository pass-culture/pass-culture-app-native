import { RouteParams, AllNavParamList } from 'features/navigation/RootNavigator'

export interface DeeplinkParts {
  routeName: string
  params: Record<string, string>
}

export interface DeeplinkEvent {
  url: string
}

type SerializedParams = Record<string, string>

type ScreenConfiguration<ScreenName extends keyof AllNavParamList> = {
  screen: ScreenName
  params: RouteParams<AllNavParamList, ScreenName>
}

export type AllowedDeeplinkRoutes = keyof DeepLinksToScreenConfiguration

export type DeepLinksToScreenConfiguration = {
  default: (params?: SerializedParams) => ScreenConfiguration<'Home'>
  favoris: (params?: SerializedParams) => ScreenConfiguration<'Favorites'>
  login: (params?: SerializedParams) => ScreenConfiguration<'Login'>
  'mot-de-passe-perdu': (
    params?: SerializedParams
  ) =>
    | ScreenConfiguration<'ReinitializePassword'>
    | ScreenConfiguration<'ResetPasswordExpiredLink'>
    | ScreenConfiguration<'Home'>
  offer: (params?: SerializedParams) => ScreenConfiguration<'Offer'>
  profil: (params?: SerializedParams) => ScreenConfiguration<'Profile'>
  recherche: (params?: SerializedParams) => ScreenConfiguration<'Search'>
}
