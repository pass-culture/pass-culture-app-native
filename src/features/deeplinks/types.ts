import { RouteParams } from 'features/navigation/RootNavigator'

export interface DeeplinkParts {
  routeName: string
  params: Record<string, string>
}

export interface DeeplinkEvent {
  url: string
}

export type DeepLinksToScreenMap = {
  default: 'Home'
  favoris: 'Favorites'
  login: 'Login'
  'mot-de-passe-perdu': 'ReinitializePassword'
  profil: 'Profile'
  recherche: 'Search'
}

export type AllowedDeeplinkRoutes = keyof DeepLinksToScreenMap

export type DeepLinksToScreenConfiguration<
  Routes extends Record<string, string>, // 2nd string targets ScreenNames
  StackParamList extends Record<string, unknown> // unknow targets any screen params type
> = {
  [routename in keyof Routes]: (
    params?: Record<string, string>
  ) => {
    screen: keyof StackParamList
    params?: RouteParams<StackParamList, keyof StackParamList>
  }
}
