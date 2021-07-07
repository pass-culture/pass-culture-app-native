import { BottomTabBarOptions, BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Route } from '@react-navigation/native'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getShadow, getSpacing, Spacer, UniqueColors } from 'ui/theme'

import { useCustomSafeInsets } from '../../../ui/theme/useCustomSafeInsets'

import { TabRouteName, TabParamList } from './types'

export const TabBar: React.FC<Pick<
  BottomTabBarProps<BottomTabBarOptions>,
  'state' | 'navigation'
>> = ({ navigation, state }) => {
  const { bottom } = useCustomSafeInsets()
  const routes = state.routes as Route<TabRouteName, TabParamList>[]
  return (
    <MainContainer>
      <RowContainer>
        <Spacer.Row numberOfSpaces={4} />
        {routes.map((route, index) => {
          const isSelected = state.index === index
          const onPress = () => {
            if (isSelected) return
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
            <TouchableOpacity key={`key-tab-nav-${index}-${route.key}`} onPress={onPress}>
              <Text>{route.name}</Text>
            </TouchableOpacity>
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
})
const SafeAreaPlaceholder = styled.View<{ safeHeight: number }>(({ safeHeight }) => ({
  height: safeHeight,
}))
const MainContainer = styled.View({
  alignItems: 'center',
  border: getSpacing(1 / 4),
  borderColor: ColorsEnum.GREY_LIGHT,
  backgroundColor: UniqueColors.TAB_BAR,
  width: '100%',
  position: 'absolute',
  bottom: 0,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1 / 4),
    },
    shadowRadius: getSpacing(1),
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.2,
  }),
})
