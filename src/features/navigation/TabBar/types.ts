import { IdCheckRoute } from '@pass-culture/id-check'
import { PathConfig } from '@react-navigation/native'
import { StackNavigationOptions } from '@react-navigation/stack'

import { SearchState } from 'features/search/types'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home?: { entryId?: string }
  Search?: Partial<SearchState>
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

export interface TabRoute extends IdCheckRoute<StackNavigationOptions, TabParamList> {
  pathConfig?: PathConfig
}
export interface TabNavigateConfig<Screen extends TabRouteName> {
  screen: 'TabNavigator'
  params: {
    screen: Screen
    params: TabParamList[Screen]
  }
}
