import { RouteParams, RootStackParamList } from 'features/navigation/RootNavigator/types'

export interface DeeplinkParts {
  screen: keyof RootStackParamList
  params: RouteParams<RootStackParamList, keyof RootStackParamList>
}
