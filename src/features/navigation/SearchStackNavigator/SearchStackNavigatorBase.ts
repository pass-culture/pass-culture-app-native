import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SearchStackParamList } from './SearchStackTypes'

export const SearchStackNavigatorBase = createNativeStackNavigator<SearchStackParamList>()
