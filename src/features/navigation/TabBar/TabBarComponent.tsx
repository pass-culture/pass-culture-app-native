import React from 'react'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/routes'
import { TabParamList, TabRouteName } from 'features/navigation/TabBar/types'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, getSpacing } from 'ui/theme'
import { TouchableLink } from 'ui/web/link/TouchableLink'
import { To } from 'ui/web/link/types'

const SELECTOR_WIDTH = '80%'
const SELECTOR_HEIGHT = getSpacing(1)

interface Props {
  isSelected?: boolean
  BicolorIcon: React.FC<BicolorIconInterface>
  to?: To<TabParamList, keyof TabParamList>
  onPress: () => void
  tabName: TabRouteName
}

export const TabBarComponent: React.FC<Props> = ({
  isSelected,
  BicolorIcon,
  to,
  onPress,
  tabName,
}) => (
  <TabComponentContainer
    to={to}
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
    <StyledIcon as={BicolorIcon} selected={isSelected} />
    <Spacer.Flex />
    {!!isSelected && <BicolorSelectorPlaceholder />}
  </TabComponentContainer>
)

const StyledIcon = styled(BicolorLogo).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? undefined : theme.colors.greyDark,
  size: theme.icons.sizes.standard,
  thin: !selected,
}))<{ selected?: boolean }>``

const BicolorSelectorPlaceholder = styled.View({ height: SELECTOR_HEIGHT })

const TabComponentContainer = styled(TouchableLink)(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBarHeight,
  flex: 1,
}))
