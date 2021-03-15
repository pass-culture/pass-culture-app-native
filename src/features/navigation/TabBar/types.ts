import { ComponentType } from 'react'

import { ParsedAlgoliaParameters } from 'libs/algolia'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  InitialRoutingScreen: undefined
  Home: { shouldDisplayLoginModal: boolean }
  Search: { parameters: ParsedAlgoliaParameters | null } | undefined
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

export type TabRoute = {
  name: TabRouteName
  component: ComponentType
  params?: TabParamList[TabRouteName]
  key: string
}
