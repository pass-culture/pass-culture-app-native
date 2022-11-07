import { TabNavigationState } from '@react-navigation/native'

import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { SearchState } from 'features/search/types'
import { ArrayElement } from 'libs/typesUtils/typeHelpers'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home: { entryId?: string } | undefined
  Search?: Partial<SearchState>
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

export type TabNavigationStateType = TabNavigationState<TabParamList>

export type TabStateRoute = ArrayElement<TabNavigationStateType['routes']> & {
  isSelected?: boolean
}

export type TabRoute = GenericRoute<TabParamList>
