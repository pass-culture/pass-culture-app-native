import { RouteParams, AllNavParamList, ScreenNames } from 'features/navigation/RootNavigator'

export interface DeeplinkParts {
  screen: ScreenNames
  params: RouteParams<AllNavParamList, ScreenNames>
}

export interface DeeplinkEvent {
  url: string
}

export type ScreenConfiguration<ScreenName extends keyof AllNavParamList> = {
  screen: ScreenName
  params: RouteParams<AllNavParamList, ScreenName>
}
