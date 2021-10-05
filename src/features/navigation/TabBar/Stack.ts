import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { TabParamList } from 'features/navigation/TabBar/types'

export const TabStack = createBottomTabNavigator<TabParamList>()
