import { NavigatorScreenParams, TabNavigationState } from '@react-navigation/native'

import { BookingsTab } from 'features/bookings/enum'
import { SearchStackParamList } from 'features/navigation/navigators/SearchStackNavigator/types'
import { TabScreens } from 'features/navigation/TabBar/isTabNavigatorScreen'
import { ArrayElement } from 'libs/typesUtils/typeHelpers'
import { AccessibleIcon } from 'ui/svg/icons/types'

type HomeParams =
  | {
      latitude?: number
      longitude?: number
      videoModuleId?: string
    }
  | undefined

type BookingsParams =
  | {
      activeTab?: BookingsTab
    }
  | undefined

export type TabParamList = {
  Home: HomeParams
  SearchStackNavigator?: NavigatorScreenParams<SearchStackParamList>
  Bookings: BookingsParams
  Favorites: undefined
  Profile: undefined
}

export type TabNavigationStateType = TabNavigationState<TabParamList>

export type TabStateRoute = ArrayElement<TabNavigationStateType['routes']> & {
  isSelected?: boolean
}

export type TabInnerComponentProps = {
  isSelected?: boolean
  BicolorIcon: React.FC<AccessibleIcon>
  tabName: TabScreens
  badgeValue?: number
  showBadge?: boolean
}
