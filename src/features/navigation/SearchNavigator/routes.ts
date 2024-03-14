import { LinkingOptions } from '@react-navigation/native'

import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { searchScreensConfig } from 'features/navigation/SearchNavigator/screens'
import { Search } from 'features/search/pages/Search/Search'

import { SearchRoute, SearchStackParamList } from './types'

const initialRouteName = 'Search'

export const routes: SearchRoute[] = [
  {
    name: 'Search',
    component: Search,
    pathConfig: {
      path: 'recherche',
      parse: screenParamsParser['Search'],
      stringify: screenParamsStringifier['Search'],
    },
    options: { title: 'recherche' },
  },
]

export const searchNavigatorPathConfig: LinkingOptions<SearchStackParamList>['config'] = {
  initialRouteName,
  screens: searchScreensConfig,
}
