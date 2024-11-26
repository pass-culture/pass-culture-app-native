import { createStackNavigator } from '@react-navigation/stack'

import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'

export const VenueMapFiltersStack = createStackNavigator<VenueMapFiltersModalStackParamList>()
