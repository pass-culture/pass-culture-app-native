import { ParsedAlgoliaParameters } from 'libs/algolia'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home: { shouldDisplayLoginModal: boolean }
  Search: { parameters: ParsedAlgoliaParameters | null }
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}
