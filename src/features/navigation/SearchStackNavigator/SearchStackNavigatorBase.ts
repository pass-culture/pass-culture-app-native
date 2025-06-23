import { createStackNavigator } from '@react-navigation/stack'

import { SearchStackParamList } from './SearchStackTypes'

export const SearchStackNavigatorBase = createStackNavigator<SearchStackParamList>()
