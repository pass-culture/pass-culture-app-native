import React from 'react'

import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/SearchStackNavigator/searchStackNavigationOptions'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'
import { SearchStackRoute } from 'features/navigation/SearchStackNavigator/types'
import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { SearchView } from 'features/search/types'

export const SearchStackNavigator = () => {
  return (
    <SearchStack.Navigator
      initialRouteName={SearchView.Filter}
      screenOptions={SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS}>
      {routes.map(({ name, component }) => (
        <SearchStack.Screen name={name} key={name} component={component} />
      ))}
    </SearchStack.Navigator>
  )
}

const routes: SearchStackRoute[] = [
  {
    name: SearchView.Landing,
    component: SearchLanding,
  },
  {
    name: SearchView.Results,
    component: SearchResults,
  },
  {
    name: SearchView.Thematic,
    component: ThematicSearch,
  },
  {
    name: SearchView.Filter,
    component: SearchFilter,
  },
]
