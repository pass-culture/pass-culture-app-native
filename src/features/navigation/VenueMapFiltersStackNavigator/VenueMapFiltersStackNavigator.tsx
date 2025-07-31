import React from 'react'
import { StatusBar } from 'react-native'
import { useTheme } from 'styled-components/native'

import { VenueMapFiltersStack } from 'features/navigation/VenueMapFiltersStackNavigator/VenueMapFiltersStack'
import { VenueMapFiltersList } from 'features/venueMap/components/VenueMapFiltersList/VenueMapFiltersList'
import { VenueMapTypeFilter } from 'features/venueMap/components/VenueMapTypeFilter/VenueMapTypeFilter'

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
        <VenueMapFiltersStack.Screen name="VenueMapTypeFilter" component={VenueMapTypeFilter} />
      </VenueMapFiltersStack.Navigator>
    </React.Fragment>
  )
}
