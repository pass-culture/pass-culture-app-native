import { ParsedAlgoliaParameters } from 'libs/algolia'

export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home: { shouldDisplayLoginModal: boolean }
  Search: { parameters: ParsedAlgoliaParameters | null } | undefined
  Bookings: undefined
  Favorites: undefined
  // TODO: ticket 6311: remove the cheat area
  CheatArea: undefined
  Profile: undefined
}
