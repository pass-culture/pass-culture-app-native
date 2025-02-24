import React from 'react'

import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/SearchStackNavigator/searchStackNavigationOptions'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'
import {
  SearchStackRoute,
  SearchStackScreenNames,
} from 'features/navigation/SearchStackNavigator/types'
import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
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
  },
  {
    name: 'SearchResults',
    component: SearchResults,
  },
  {
    name: 'ThematicSearch',
    component: ThematicSearch,
  },
  {
    name: 'SearchFilter',
    component: SearchFilter,
  },
]
