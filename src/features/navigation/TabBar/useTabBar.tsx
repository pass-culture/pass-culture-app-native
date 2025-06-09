import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useEffect } from 'react'

import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { TabNavigationStateType } from 'features/navigation/TabBar/TabStackNavigatorTypes'

type TabBarProps = Pick<BottomTabBarProps, 'state'>

export const useTabBar = ({ state }: TabBarProps) => {
  const { setTabNavigationState } = useTabNavigationContext()

  useEffect(() => {
    setTabNavigationState(state as TabNavigationStateType)
  }, [state, setTabNavigationState])
}
