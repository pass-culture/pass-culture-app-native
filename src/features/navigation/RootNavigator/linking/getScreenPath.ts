import { AllNavParamList } from 'features/navigation/RootNavigator'

import { linking } from './index'

export function getScreenPath<RouteName extends keyof AllNavParamList>(
  screen: RouteName,
  params: AllNavParamList[RouteName]
) {
  return linking.getPathFromState({ routes: [{ name: screen, params }] }, linking.config)
}
