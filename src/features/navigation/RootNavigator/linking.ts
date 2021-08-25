import { t } from '@lingui/macro'
import { getPathFromState, LinkingOptions } from '@react-navigation/native'

import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { WEBAPP_V2_URL } from 'libs/environment'

import { routes } from './routes'

export const linking: LinkingOptions = {
  prefixes: [WEBAPP_V2_URL, 'passculture://'],
  config: {
    screens: {
      ...routes.reduce(
        (route, currentRoute) => ({
          ...route,
          [currentRoute.name]: currentRoute.pathConfig || currentRoute.path,
        }),
        {}
      ),
    },
  },
  getPathFromState: (state, config) => {
    const path = getPathFromState(state, config)
    // We cannot customize the 404 screen path with react-navigation, as it takes the screen names instead.
    // See this issue : https://github.com/react-navigation/react-navigation/issues/9102
    const pageNotFoundScreenName: ScreenNames = 'PageNotFound'
    if (path.includes(pageNotFoundScreenName)) {
      return t`page-introuvable`
    }
    return path
  },
}
