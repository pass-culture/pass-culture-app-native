import { LinkingOptions } from '@react-navigation/native'

import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'
import { SearchN1 } from 'features/search/pages/Search/SearchN1/SearchN1'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'

import { SearchStackRoute, SearchStackParamList, SearchStackRouteName } from './types'

export const initialSearchStackRouteName: SearchStackRouteName = 'SearchLanding'

const routes: SearchStackRoute[] = [
  {
    name: 'SearchLanding',
    component: SearchLanding,
    pathConfig: {
      path: 'recherche/accueil',
      parse: screenParamsParser['SearchLanding'],
      stringify: screenParamsStringifier['SearchLanding'],
    },
    options: { title: 'Rechercher des offres' },
  },
  {
    name: 'SearchResults',
    component: SearchResults,
    pathConfig: {
      path: 'recherche/resultats',
      parse: screenParamsParser['SearchResults'],
      stringify: screenParamsStringifier['SearchResults'],
    },
    options: { title: 'Résultats de recherche' },
  },
  {
    name: 'SearchN1',
    component: SearchN1,
    pathConfig: {
      path: 'rechercheN1',
      parse: screenParamsParser['SearchN1'],
      stringify: screenParamsStringifier['SearchN1'],
    },
    options: { title: 'recherche dans les sous-catégories' },
  },
]

const { screensConfig: searchScreensConfig, Screens: SearchScreens } = getScreensAndConfig(
  routes,
  SearchStack.Screen
)
export { SearchScreens }

export const searchNavigatorPathConfig: LinkingOptions<SearchStackParamList>['config'] = {
  initialRouteName: initialSearchStackRouteName,
  screens: searchScreensConfig,
}

const searchStackRouteNames = routes.map((route) => route.name)

// Typeguard for screen params
export function isSearchStackScreen(screen: ScreenNames): screen is SearchStackRouteName {
  // @ts-expect-error : ScreenNames is not necessarily a screen in SearchStackRouteNames
  return searchStackRouteNames.includes(screen)
}
