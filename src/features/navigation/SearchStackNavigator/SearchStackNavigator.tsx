import React from 'react'

import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/SearchStackNavigator/searchStackNavigationOptions'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { SearchView } from 'features/search/types'

export const SearchStackNavigator = () => {
  return (
    <SearchStack.Navigator
      initialRouteName={SearchView.Landing}
      screenOptions={SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS}>
      <SearchStack.Screen name={SearchView.Landing} component={SearchLanding} />
      <SearchStack.Screen name={SearchView.Results} component={SearchResults} />
      <SearchStack.Screen name={SearchView.Thematic} component={ThematicSearch} />
    </SearchStack.Navigator>
  )
}
