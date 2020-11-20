import { RouteParams, HomeStackParamList } from 'features/home/navigation/HomeNavigator'

import { RootTabParamList } from '../navigation/RootTabNavigator'

export interface DeeplinkParts {
  routeName: string
  params: Record<string, string>
}

export interface DeeplinkEvent {
  url: string
}

type DeepLinksToScreenMap = {
  'mot-de-passe-perdu': 'ReinitializePassword'
  profil: 'Profile'
  favoris: 'Favorites'
  recherche: 'Search'
  login: 'Login'
  default: 'Home'
}

export type DeepLinksToScreenConfiguration<
  Routes extends Record<string, string>, // 2nd string targets ScreenNames
  StackParamList extends Record<string, unknown> // unknow targets any screen params type
> = {
  [routename in keyof Routes]: {
    screen: Routes[routename]
    paramConverter?: (
      params: Record<string, string>
    ) => RouteParams<StackParamList, Routes[routename]>
  }
}

export const DEEPLINK_TO_SCREEN_CONFIGURATION: DeepLinksToScreenConfiguration<
  DeepLinksToScreenMap,
  RootTabParamList & HomeStackParamList
> = {
  'mot-de-passe-perdu': {
    screen: 'ReinitializePassword',
    paramConverter: ({
      token,
      expiration_timestamp,
    }: Record<string, string>): RouteParams<HomeStackParamList, 'ReinitializePassword'> => ({
      token,
      expiration_timestamp: Number(expiration_timestamp),
    }),
  },
  profil: {
    screen: 'Profile',
  },
  favoris: {
    screen: 'Favorites',
  },
  recherche: {
    screen: 'Search',
  },
  login: {
    screen: 'Login',
  },
  default: {
    screen: 'Home',
  },
}

export type AllowedDeeplinkRoutes = keyof typeof DEEPLINK_TO_SCREEN_CONFIGURATION
