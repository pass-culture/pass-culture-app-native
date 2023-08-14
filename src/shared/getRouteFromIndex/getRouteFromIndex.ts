import { ParamListBase, RouteProp } from '@react-navigation/core'

export function getRouteFromIndex(routes: RouteProp<ParamListBase>[], indexPreviousRoute: number) {
  if (!routes.length) {
    return undefined
  }

  return routes[routes.length - indexPreviousRoute]
}
