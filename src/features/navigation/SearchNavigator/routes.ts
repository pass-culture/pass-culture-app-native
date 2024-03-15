import { LinkingOptions } from '@react-navigation/native'

import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { SearchStack } from 'features/navigation/SearchNavigator/Stack'
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

export const { screensConfig: searchScreensConfig, Screens: SearchScreens } = getScreensAndConfig(
  routes,
  SearchStack.Screen
)

export const searchNavigatorPathConfig: LinkingOptions<SearchStackParamList>['config'] = {
  initialRouteName,
  screens: searchScreensConfig,
}
