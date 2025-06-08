import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { TabParamList } from 'features/navigation/TabBar/TabStackNavigatorTypes'

export const TabStackNavigatorBase = createBottomTabNavigator<TabParamList>()
