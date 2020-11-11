import { RouteParams, HomeStackParamList } from 'features/home/navigation/HomeNavigator'

export interface DeeplinkParts {
  routeName: string
  params: Record<string, string>
}

export interface DeeplinkEvent {
  url: string
}

type DeepLinksToScreenMap = {
  'mot-de-passe-perdu': 'ReinitializePassword'
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
  HomeStackParamList
> = {
  'mot-de-passe-perdu': {
    screen: 'ReinitializePassword',
    paramConverter: ({
      token,
      expiration_date,
    }: Record<string, string>): RouteParams<HomeStackParamList, 'ReinitializePassword'> => ({
      token,
      expiration_date: Number(expiration_date),
    }),
  },
  default: {
    screen: 'Home',
  },
}

export type AllowedDeeplinkRoutes = keyof typeof DEEPLINK_TO_SCREEN_CONFIGURATION
