import { RouteParams } from './RootNavigator'
import { TabParamList } from './TabBar/TabNavigator'

export const NavigateToHomeWithoutModalOptions: RouteParams<TabParamList, 'Home'> = {
  shouldDisplayLoginModal: false,
}
