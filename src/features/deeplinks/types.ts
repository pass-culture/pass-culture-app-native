import { RouteParams, RootStackParamList } from 'features/navigation/RootNavigator'

export interface DeeplinkParts {
  screen: keyof RootStackParamList
  params: RouteParams<RootStackParamList, keyof RootStackParamList>
}
