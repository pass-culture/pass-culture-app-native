import React from 'react'

import { NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { ScreenNames } from 'features/navigation/RootNavigator/types'

import { RootScreens } from './screens'
import { RootStack } from './Stack'

const RootStackNavigator = ({ initialRouteName }: { initialRouteName: ScreenNames }) => {
  return (
    <RootStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={NAVIGATOR_SCREEN_OPTIONS}>
      {RootScreens}
    </RootStack.Navigator>
  )
}

export const RootNavigator: React.ComponentType = () => {
  const initialScreen = 'FirstTutorial'

  return <RootStackNavigator initialRouteName={initialScreen} />
}
