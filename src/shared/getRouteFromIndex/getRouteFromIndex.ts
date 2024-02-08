import { ParamListBase, RouteProp } from '@react-navigation/native'

export function getRouteFromIndex(routes: RouteProp<ParamListBase>[], indexPreviousRoute: number) {
  if (!routes.length) {
    return undefined
  }

  return routes[routes.length - indexPreviousRoute]
}
