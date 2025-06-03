import { LinkingOptions } from '@react-navigation/native'

import { SearchStackParamList } from '../types'

export const searchNavigatorPathConfig: LinkingOptions<SearchStackParamList>['config'] = {
  initialRouteName: 'SearchLanding',
  screens: {
    SearchLanding: {
      path: 'recherche/accueil',
      parse: {},
      stringify: {},
    },
    SearchResults: {
      path: 'recherche/resultats',
      parse: {},
      stringify: {},
    },
    AISearch: {
      path: 'recherche/inspirational',
      parse: {},
      stringify: {},
    },
  },
}
