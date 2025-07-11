import { LinkingOptions } from '@react-navigation/native'

import { SearchStackParamList } from '../SearchStackTypes'

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
  },
}
