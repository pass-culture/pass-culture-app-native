import React from 'react'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/routes'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, getSpacing } from 'ui/theme'

const SELECTOR_WIDTH = '80%'
const SELECTOR_HEIGHT = getSpacing(1)

interface Props {
  isSelected?: boolean
  BicolorIcon: React.FC<BicolorIconInterface>
  onPress: () => void
  tabName: TabRouteName
}

export const TabBarComponent: React.FC<Props> = ({ isSelected, BicolorIcon, onPress, tabName }) => {
  const StyledBicolorIcon = styled(BicolorIcon).attrs(({ theme }) => ({
    color: isSelected ? undefined : theme.colors.greyDark,
    size: theme.icons.sizes.standard,
    thin: !isSelected,
  }))``

  return (
    <TabComponentContainer
      onPress={onPress}
      activeOpacity={1}
      {...accessibilityAndTestId(menu[tabName].accessibilityLabel, `${tabName} tab`)}>
      {!!isSelected && (
        <BicolorSelector
          width={SELECTOR_WIDTH}
          height={SELECTOR_HEIGHT}
          testID={`${tabName} tab selected`}
        />
      )}
      <Spacer.Flex />
      <StyledBicolorIcon />
      <Spacer.Flex />
      {!!isSelected && <BicolorSelectorPlaceholder />}
    </TabComponentContainer>
  )
}

const BicolorSelectorPlaceholder = styled.View({ height: SELECTOR_HEIGHT })

const TabComponentContainer = styled.TouchableOpacity(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBarHeight,
  flex: 1,
}))
