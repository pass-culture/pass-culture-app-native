import { RouteParams, RootStackParamList } from 'features/navigation/RootNavigator'

export interface DeeplinkParts {
  screen: keyof RootStackParamList
  params: RouteParams<RootStackParamList, keyof RootStackParamList>
}

export interface DeeplinkEvent {
  url: string
}

export type ScreenConfiguration<ScreenName extends keyof RootStackParamList> = {
  screen: ScreenName
  params: RouteParams<RootStackParamList, ScreenName>
}
