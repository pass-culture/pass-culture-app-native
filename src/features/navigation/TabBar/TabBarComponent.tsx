import React from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Spacer, getSpacing } from 'ui/theme'

const SELECTOR_WIDTH = '80%'
const SELECTOR_HEIGHT = getSpacing(1)

interface TabComponentInterface {
  isSelected?: boolean
  BicolorIcon: React.FC<BicolorIconInterface>
  onPress: () => void
  tabName: string
}
export const TabBarComponent: React.FC<TabComponentInterface> = ({
  isSelected,
  BicolorIcon,
  onPress,
  tabName,
}) => {
  return (
    <TabComponentContainer
      onPress={onPress}
      activeOpacity={1}
      {...accessibilityAndTestId(`${tabName} tab`)}>
      {!!isSelected && (
        <BicolorSelector
          width={SELECTOR_WIDTH}
          height={SELECTOR_HEIGHT}
          {...accessibilityAndTestId(`${tabName} tab selected`)}
        />
      )}
      <Spacer.Flex />
      <BicolorIcon
        color={isSelected ? undefined : ColorsEnum.GREY_DARK}
        size={getSpacing(11)}
        thin={!isSelected}
      />
      <Spacer.Flex />
      {!!isSelected && <BicolorSelectorPlaceholder />}
    </TabComponentContainer>
  )
}

const BicolorSelectorPlaceholder = styled.View({ height: SELECTOR_HEIGHT })

const TabComponentContainer = styled.TouchableOpacity(({ theme }) => ({
  marginTop: -getSpacing(1 / 4),
  height: theme.tabBarHeight,
  flex: 1,
  alignItems: 'center',
}))
