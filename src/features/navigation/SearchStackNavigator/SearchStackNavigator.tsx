import React from 'react'

import { SearchScreens } from 'features/navigation/SearchStackNavigator/routes'
import { SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/SearchStackNavigator/searchStackNavigationOptions'
import { SearchStack } from 'features/navigation/SearchStackNavigator/Stack'
import { SearchStackScreenNames } from 'features/navigation/SearchStackNavigator/types'

export const SearchStackNavigator = ({
  initialRouteName,
}: {
  initialRouteName: SearchStackScreenNames
}) => {
  return (
    <SearchStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={SEARCH_STACK_NAVIGATOR_SCREEN_OPTIONS}>
      {SearchScreens}
    </SearchStack.Navigator>
  )
}
