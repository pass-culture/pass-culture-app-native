import { RouteNames } from 'features/navigation/RootNavigator'

export interface DeeplinkParts {
  routeName: AllowedDeeplinkRoutes
  params: Record<string, string>
}

export interface DeeplinkEvent {
  url: string
}

export type DeepLinkToScreenMap = { [route: string]: RouteNames }
export const deeplinkRoutesToScreensMap: DeepLinkToScreenMap = {
  'mot-de-passe-perdu': 'ReinitializePassword',
}

export type AllowedDeeplinkRoutes = keyof typeof deeplinkRoutesToScreensMap
