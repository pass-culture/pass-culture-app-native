import { TabNavigationState } from '@react-navigation/native'

import { BookingsTab } from 'features/bookings/enum'
import {
  ProfileStackParamList,
  ProfileStackRouteName,
} from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { GenericRoute } from 'features/navigation/RootNavigator/types'
import {
  SearchStackParamList,
  SearchStackScreenNames,
} from 'features/navigation/SearchStackNavigator/types'
import { ArrayElement } from 'libs/typesUtils/typeHelpers'
import { AccessibleBicolorIcon } from 'ui/svg/icons/types'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home: { latitude?: number; longitude?: number; videoModuleId?: string } | undefined
  SearchStackNavigator?: {
    screen: SearchStackScreenNames
    params: SearchStackParamList[SearchStackScreenNames]
  }
  Bookings: { activeTab?: BookingsTab } | undefined
  Favorites: undefined
  ProfileStackNavigator?: {
    screen: ProfileStackRouteName
    params: ProfileStackParamList[ProfileStackRouteName]
  }
}

export type TabNavigationStateType = TabNavigationState<TabParamList>

export type TabStateRoute = ArrayElement<TabNavigationStateType['routes']> & {
  isSelected?: boolean
}

export type TabRoute = GenericRoute<TabParamList>

export type TabInnerComponentProps = {
  isSelected?: boolean
  BicolorIcon: React.FC<AccessibleBicolorIcon>
  tabName: TabRouteName
  badgeValue?: number
}
