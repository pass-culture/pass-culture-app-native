import React from 'react'

import { screenParamsParser, screenParamsStringifier } from 'features/navigation/screenParamsUtils'
import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/SearchStackNavigator/searchStackNavigationOptions'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'
import {
  SearchStackRoute,
  SearchStackScreenNames,
} from 'features/navigation/SearchStackNavigator/types'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'

export const SearchStackNavigator = ({
  initialRouteName,
}: {
  initialRouteName: SearchStackScreenNames
}) => {
  return (
    <SearchStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS}>
      {routes.map(({ name, component }) => (
        <SearchStack.Screen name={name} key={name} component={component} />
      ))}
    </SearchStack.Navigator>
  )
}

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
    name: 'ThematicSearch',
    component: ThematicSearch,
    pathConfig: {
      path: 'recherche/thematique',
      parse: screenParamsParser['ThematicSearch'],
      stringify: screenParamsStringifier['ThematicSearch'],
    },
    options: { title: 'recherche dans les sous-catégories' },
  },
]
