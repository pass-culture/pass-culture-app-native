import React from 'react'

import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/SearchStackNavigator/searchStackNavigationOptions'
import { SearchStackNavigatorBase } from 'features/navigation/SearchStackNavigator/SearchStackNavigatorBase'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { SearchView } from 'features/search/types'

export const SearchStackNavigator = () => {
  return (
    <SearchStackNavigatorBase.Navigator
      initialRouteName={SearchView.Landing}
      screenOptions={SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS}>
      <SearchStackNavigatorBase.Screen name={SearchView.Landing} component={SearchLanding} />
      <SearchStackNavigatorBase.Screen name={SearchView.Results} component={SearchResults} />
      <SearchStackNavigatorBase.Screen name={SearchView.Thematic} component={ThematicSearch} />
    </SearchStackNavigatorBase.Navigator>
  )
}
