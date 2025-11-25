import { RouteParams, RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'

export interface DeeplinkParts {
  screen: keyof RootStackParamList
  params: RouteParams<RootStackParamList, keyof RootStackParamList>
}
