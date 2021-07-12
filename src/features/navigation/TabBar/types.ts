import { ComponentType } from 'react'

import { SearchParameters } from 'features/search/types'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home: { entryId: string } | undefined
  Search: { parameters: SearchParameters | null } | undefined
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

export type TabRoute = {
  name: TabRouteName
  component: ComponentType
  params?: TabParamList[TabRouteName]
  key: string
  path: string
}
