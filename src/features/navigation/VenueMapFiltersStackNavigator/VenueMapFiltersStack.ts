import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'

export const VenueMapFiltersStack = createNativeStackNavigator<VenueMapFiltersModalStackParamList>()
