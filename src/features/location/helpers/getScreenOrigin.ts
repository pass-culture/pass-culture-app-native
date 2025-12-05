import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export const getScreenOrigin = (navigation: UseNavigationType) => {
  const currentRoute = navigation.getState()?.routes.find((route) => route.name === 'LocationModal')

  return currentRoute &&
    'params' in currentRoute &&
    currentRoute.params &&
    'screenOrigin' in currentRoute.params
    ? (currentRoute.params as { screenOrigin?: 'home' | 'search' | 'venueMap' }).screenOrigin
    : undefined
}
