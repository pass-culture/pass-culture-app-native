import { LinkingOptions } from '@react-navigation/native'

import { ComponentForPathConfig } from 'features/navigation/ComponentForPathConfig'
import { getScreensAndConfig } from 'features/navigation/RootNavigator/linking/getScreensConfig'
import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'
import { SearchView } from 'features/search/types'

import { SearchStackRoute, SearchStackParamList, SearchStackRouteName } from './types'

const initialSearchStackRouteName: SearchStackRouteName = SearchView.Landing

const routes: SearchStackRoute[] = [
  {
    name: SearchView.Landing,
    component: ComponentForPathConfig,
    pathConfig: {
      path: 'recherche/accueil',
      parse: screenParamsParser[SearchView.Landing],
      stringify: screenParamsStringifier[SearchView.Landing],
    },
    options: { title: 'Rechercher des offres' },
  },
  {
    name: SearchView.Results,
    component: ComponentForPathConfig,
    pathConfig: {
      path: 'recherche/resultats',
      parse: screenParamsParser[SearchView.Results],
      stringify: screenParamsStringifier[SearchView.Results],
    },
    options: { title: 'Résultats de recherche' },
  },
  {
    name: SearchView.Thematic,
    component: ComponentForPathConfig,
    pathConfig: {
      path: 'recherche/thematique',
      parse: screenParamsParser[SearchView.Thematic],
      stringify: screenParamsStringifier[SearchView.Thematic],
    },
    options: { title: 'recherche dans les sous-catégories' },
  },
  {
    name: SearchView.Filter,
    component: ComponentForPathConfig,
    pathConfig: {
      path: 'recherche/filtres',
      parse: screenParamsParser[SearchView.Filter],
      stringify: screenParamsStringifier[SearchView.Filter],
    },
    options: { title: 'Filtres de recherche' },
  },
]

const { screensConfig: searchScreensConfig } = getScreensAndConfig(routes, SearchStack.Screen)

export const searchNavigatorPathConfig: LinkingOptions<SearchStackParamList>['config'] = {
  initialRouteName: initialSearchStackRouteName,
  screens: searchScreensConfig,
}

export function isSearchStackScreen(screen: string): screen is SearchStackRouteName {
  const searchStackRouteNames = routes.map((route): string => route.name)
  return searchStackRouteNames.includes(screen)
}
