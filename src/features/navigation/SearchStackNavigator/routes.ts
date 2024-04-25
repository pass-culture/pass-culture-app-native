import { LinkingOptions } from '@react-navigation/native'

import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'
import { Search } from 'features/search/pages/Search/Search'
import { SearchN1Books } from 'features/search/pages/Search/SearchN1Books/SearchN1Books'

import { SearchStackRoute, SearchStackParamList, SearchStackRouteName } from './types'

const initialRouteName = 'Search'

const routes: SearchStackRoute[] = [
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
  {
    name: 'SearchN1Books',
    component: SearchN1Books,
    pathConfig: {
      path: 'rechercheN1Books',
      parse: screenParamsParser['SearchN1Books'],
      stringify: screenParamsStringifier['SearchN1Books'],
    },
    options: { title: 'recherche dans les livres' },
  },
]

const { screensConfig: searchScreensConfig, Screens: SearchScreens } = getScreensAndConfig(
  routes,
  SearchStack.Screen
)
export { SearchScreens }

export const searchNavigatorPathConfig: LinkingOptions<SearchStackParamList>['config'] = {
  initialRouteName,
  screens: searchScreensConfig,
}

const searchStackRouteNames = routes.map((route) => route.name)

// Typeguard for screen params
export function isSearchStackScreen(screen: ScreenNames): screen is SearchStackRouteName {
  // @ts-expect-error : ScreenNames is not necessarily a screen in SearchStackRouteNames
  return searchStackRouteNames.includes(screen)
}
