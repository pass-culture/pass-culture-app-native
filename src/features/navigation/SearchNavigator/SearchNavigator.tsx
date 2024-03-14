import React from 'react'

import { SearchScreens } from 'features/navigation/SearchNavigator/screens'
import { SearchStack } from 'features/navigation/SearchNavigator/Stack'
import { SearchScreenNames } from 'features/navigation/SearchNavigator/types'

export const SearchStackNavigator = ({
  initialRouteName,
}: {
  initialRouteName: SearchScreenNames
}) => {
  return (
    <SearchStack.Navigator initialRouteName={initialRouteName}>
      {SearchScreens}
    </SearchStack.Navigator>
  )
}
