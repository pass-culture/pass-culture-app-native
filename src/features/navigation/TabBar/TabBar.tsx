import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'
import styled from 'styled-components/native'

import { useTabNavigationContext } from 'features/navigation/TabBar/TabNavigationStateContext'
import { getShadow, getSpacing, Spacer } from 'ui/theme'

import { useCustomSafeInsets } from '../../../ui/theme/useCustomSafeInsets'

import { mapTabRouteToBicolorIcon } from './mapTabRouteToBicolorIcon'
import { TabBarComponent } from './TabBarComponent'
import { TabRouteName } from './types'

type Props = Pick<BottomTabBarProps, 'navigation'>

export const TabBar: React.FC<Props> = ({ navigation }) => {
  const { tabRoutes } = useTabNavigationContext()
  const { bottom } = useCustomSafeInsets()
  return (
    <MainContainer>
      <RowContainer>
        <Spacer.Row numberOfSpaces={4} />
        {tabRoutes.map((route) => {
          const onPress = () => {
            if (route.isSelected) return
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }
          return (
            <TabBarComponent
              key={`key-tab-nav-${route.key}`}
              tabName={route.name}
              isSelected={route.isSelected}
              BicolorIcon={mapTabRouteToBicolorIcon(route.name as TabRouteName)}
              onPress={onPress}
            />
          )
        })}
        <Spacer.Row numberOfSpaces={4} />
      </RowContainer>
      <SafeAreaPlaceholder safeHeight={bottom} />
    </MainContainer>
  )
}

const RowContainer = styled.View({
  flexDirection: 'row',
  width: '100%',
})

const SafeAreaPlaceholder = styled.View<{ safeHeight: number }>(({ safeHeight }) => ({
  height: safeHeight,
}))

const MainContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  border: getSpacing(1 / 4),
  borderColor: theme.colors.greyLight,
  backgroundColor: theme.uniqueColors.tabBar,
  width: '100%',
  position: 'absolute',
  bottom: 0,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1 / 4),
    },
    shadowRadius: getSpacing(1),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.2,
  }),
}))
