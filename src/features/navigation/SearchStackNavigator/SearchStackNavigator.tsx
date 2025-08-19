import React from 'react'

import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/SearchStackNavigator/searchStackNavigationOptions'
import { SearchStackNavigatorBase } from 'features/navigation/SearchStackNavigator/SearchStackNavigatorBase'
import { NearMePage } from 'features/search/pages/NearMePage/NearMePage'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { SearchView } from 'features/search/types'

type SearchRouteConfig = {
  name: SearchView
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
}

const searchScreens: SearchRouteConfig[] = [
  { name: SearchView.Landing, component: SearchLanding },
  { name: SearchView.Results, component: SearchResults },
  { name: SearchView.Thematic, component: ThematicSearch },
  { name: SearchView.NearMe, component: NearMePage },
]

export const SearchStackNavigator = () => {
  return (
    <SearchStackNavigatorBase.Navigator
      initialRouteName={SearchView.Landing}
      screenOptions={SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS}>
      {searchScreens.map(({ name, component }) => (
        <SearchStackNavigatorBase.Screen key={name} name={name} component={component} />
      ))}
    </SearchStackNavigatorBase.Navigator>
  )
}
