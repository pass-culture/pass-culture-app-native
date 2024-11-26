import React from 'react'

import { VenueMapFiltersStack } from 'features/navigation/VenueMapFiltersStackNavigator/VenueMapFiltersStack'
import { VenueMapFiltersList } from 'features/venueMap/components/VenueMapFiltersList/VenueMapFiltersList'
import { VenueMapTypeFilter } from 'features/venueMap/components/VenueMapTypeFilter/VenueMapTypeFilter'

export const VenueMapFiltersStackNavigator = () => {
  return (
    <VenueMapFiltersStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <VenueMapFiltersStack.Screen name="VenueMapFiltersList" component={VenueMapFiltersList} />
      <VenueMapFiltersStack.Screen name="VenueMapTypeFilter" component={VenueMapTypeFilter} />
    </VenueMapFiltersStack.Navigator>
  )
}
