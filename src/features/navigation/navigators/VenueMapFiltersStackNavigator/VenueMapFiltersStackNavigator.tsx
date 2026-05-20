import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { useTheme } from 'styled-components/native'

import { VenueMapFiltersModalStackParamList } from 'features/navigation/navigators/VenueMapFiltersStackNavigator/types'
import { VenueMapActivityFilter } from 'features/venueMap/components/VenueMapActivityFilter/VenueMapActivityFilter'
import { VenueMapFiltersList } from 'features/venueMap/components/VenueMapFiltersList/VenueMapFiltersList'

const VenueMapFiltersStack = createNativeStackNavigator<VenueMapFiltersModalStackParamList>()

export const VenueMapFiltersStackNavigator = () => {
  const { designSystem } = useTheme()
  return (
    <React.Fragment>
      <StatusBar
        barStyle="light-content"
        backgroundColor={designSystem.color.background.lockedInverted}
      />
      <VenueMapFiltersStack.Navigator screenOptions={{ headerShown: false }}>
        <VenueMapFiltersStack.Screen name="VenueMapFiltersList" component={VenueMapFiltersList} />
        <VenueMapFiltersStack.Screen
          name="VenueMapActivityFilter"
          component={VenueMapActivityFilter}
        />
      </VenueMapFiltersStack.Navigator>
    </React.Fragment>
  )
}
