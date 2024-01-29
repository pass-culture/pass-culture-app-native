import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { FunctionComponent } from 'react'

import { useTabBar } from 'features/navigation/TabBar/useTabBar'

type Props = Pick<BottomTabBarProps, 'state'>

export const TabBar: FunctionComponent<Props> = ({ state }) => {
  useTabBar({ state })

  return null
}
