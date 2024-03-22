import { TabNavigationState } from '@react-navigation/native'

import { GenericRoute } from 'features/navigation/RootNavigator/types'
import {
  SearchStackScreenNames,
  SearchStackParamList,
} from 'features/navigation/SearchStackNavigator/types'
import { ArrayElement } from 'libs/typesUtils/typeHelpers'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home: { latitude?: number; longitude?: number; videoModuleId?: string } | undefined
  SearchStackNavigator?: {
    screen: SearchStackScreenNames
    params: SearchStackParamList[SearchStackScreenNames]
  }
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

export type TabNavigationStateType = TabNavigationState<TabParamList>

export type TabStateRoute = ArrayElement<TabNavigationStateType['routes']> & {
  isSelected?: boolean
}

export type TabRoute = GenericRoute<TabParamList>
