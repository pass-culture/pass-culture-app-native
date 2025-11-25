import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createComponentForStaticNavigation } from '@react-navigation/native'

import { tabNavigatorConfig } from 'features/navigation/RootNavigator/linking/rootStackNavigatorPathConfig'

export const TabStackNavigator = createBottomTabNavigator(tabNavigatorConfig)

export const TabsScreen = createComponentForStaticNavigation(TabStackNavigator, 'Root')
