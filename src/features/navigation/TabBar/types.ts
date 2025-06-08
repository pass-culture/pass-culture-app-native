import { TabNavigationState } from '@react-navigation/native'

import { BookingsTab } from 'features/bookings/enum'
import {
  SearchStackParamList,
  SearchStackScreenNames,
} from 'features/navigation/SearchStackNavigator/types'
import { ArrayElement } from 'libs/typesUtils/typeHelpers'
import { AccessibleIcon } from 'ui/svg/icons/types'

export type TabRouteName = keyof TabParamList

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
  _DeeplinkOnlyHome1: HomeParams
  SearchStackNavigator?: {
    screen: SearchStackScreenNames
    params: SearchStackParamList[SearchStackScreenNames]
  }
  Bookings: BookingsParams
  _DeeplinkOnlyBookings1: BookingsParams
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
  tabName: TabRouteName
  badgeValue?: number
}
