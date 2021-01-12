export type TabRouteName = keyof TabParamList

export type TabParamList = {
  Home: { shouldDisplayLoginModal: boolean }
  Search: undefined
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}
