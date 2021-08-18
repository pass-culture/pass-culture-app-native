import { LinkingOptions } from '@react-navigation/native'

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
}
