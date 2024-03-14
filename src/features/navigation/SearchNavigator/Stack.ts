import { createStackNavigator } from '@react-navigation/stack'

import { SearchStackParamList } from 'features/navigation/SearchNavigator/types'

export const SearchStack = createStackNavigator<SearchStackParamList>()
