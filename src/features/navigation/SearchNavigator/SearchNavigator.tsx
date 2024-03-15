import React from 'react'

import { SearchScreens } from 'features/navigation/SearchNavigator/routes'
import { SEARCH_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/SearchNavigator/searchNavigationOptions'
import { SearchStack } from 'features/navigation/SearchNavigator/Stack'
import { SearchScreenNames } from 'features/navigation/SearchNavigator/types'

export const SearchStackNavigator = ({
  initialRouteName,
}: {
  initialRouteName: SearchScreenNames
}) => {
  return (
    <SearchStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={SEARCH_NAVIGATOR_SCREEN_OPTIONS}>
      {SearchScreens}
    </SearchStack.Navigator>
  )
}
