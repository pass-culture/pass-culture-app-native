import { LinkingOptions } from '@react-navigation/native'

import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { ComponentForPathConfig } from 'features/navigation/SearchStackNavigator/ComponentForPathConfig'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'

import { SearchStackRoute, SearchStackParamList, SearchStackRouteName } from './types'

const initialSearchStackRouteName: SearchStackRouteName = 'SearchLanding'

const routes: SearchStackRoute[] = [
  {
    name: 'SearchLanding',
    component: ComponentForPathConfig,
    pathConfig: {
      path: 'recherche/accueil',
      parse: screenParamsParser['SearchLanding'],
      stringify: screenParamsStringifier['SearchLanding'],
    },
    options: { title: 'Rechercher des offres' },
  },
  {
    name: 'SearchResults',
    component: ComponentForPathConfig,
    pathConfig: {
      path: 'recherche/resultats',
      parse: screenParamsParser['SearchResults'],
      stringify: screenParamsStringifier['SearchResults'],
    },
    options: { title: 'Résultats de recherche' },
  },
  {
    name: 'ThematicSearch',
    component: ComponentForPathConfig,
    pathConfig: {
      path: 'recherche/thematique',
      parse: screenParamsParser['ThematicSearch'],
      stringify: screenParamsStringifier['ThematicSearch'],
    },
    options: { title: 'recherche dans les sous-catégories' },
  },
]

const { screensConfig: searchScreensConfig } = getScreensAndConfig(routes, SearchStack.Screen)

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
