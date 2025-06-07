import { SearchStackRoute, SearchStackRouteName } from './types'

const searchRoutes: SearchStackRoute[] = []

export function isSearchStackScreen(screen: string): screen is SearchStackRouteName {
  const searchStackRouteNames = searchRoutes.map((route): string => route.name)
  return searchStackRouteNames.includes(screen)
}
