import { PathConfig } from '@react-navigation/native'
import { ComponentType } from 'react'

import { SearchState } from 'features/search/types'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home?: { entryId?: string }
  Search?: Partial<SearchState>
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

export type TabRoute = {
  name: TabRouteName
  component: ComponentType
  key: string
  params?: TabParamList[TabRouteName]
  path?: string
  pathConfig?: PathConfig
}
