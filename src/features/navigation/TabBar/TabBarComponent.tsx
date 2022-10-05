import React from 'react'
import styled from 'styled-components/native'

import { menu } from 'features/navigation/TabBar/routes'
import { TabRouteName } from 'features/navigation/TabBar/types'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { BicolorLogo } from 'ui/svg/icons/BicolorLogo'
import { BicolorSelector } from 'ui/svg/icons/BicolorSelector'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { Spacer, getSpacing, Typo } from 'ui/theme'

const SELECTOR_WIDTH = '80%'
const SELECTOR_HEIGHT = getSpacing(1)

interface Props {
  isSelected?: boolean
  BicolorIcon: React.FC<BicolorIconInterface>
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress?: () => void
  tabName: TabRouteName
}

export const TabBarComponent: React.FC<Props> = ({
  isSelected,
  BicolorIcon,
  navigateTo,
  onPress,
  tabName,
}) => (
  <TabComponentContainer
    navigateTo={navigateTo}
    onBeforeNavigate={onPress}
    activeOpacity={1}
    selected={isSelected}
    accessibilityLabel={menu[tabName].accessibilityLabel}
    testID={`${tabName} tab`}
    aria-current={isSelected ? 'page' : undefined}>
    {!!isSelected && (
      <BicolorSelector
        width={SELECTOR_WIDTH}
        height={SELECTOR_HEIGHT}
        testID={`${tabName} tab selected`}
      />
    )}
    <Spacer.Flex />
    <StyledIcon as={BicolorIcon} selected={isSelected} />
    <Title selected={isSelected}>{menu[tabName].displayName}</Title>
    <Spacer.Flex />
    {!!isSelected && <BicolorSelectorPlaceholder />}
  </TabComponentContainer>
)

const StyledIcon = styled(BicolorLogo).attrs<{ selected?: boolean }>(({ theme, selected }) => ({
  color: selected ? undefined : theme.colors.greyDark,
  size: theme.tabBar.iconSize,
  thin: !selected,
}))<{ selected?: boolean }>``

const BicolorSelectorPlaceholder = styled.View({ height: SELECTOR_HEIGHT })

const TabComponentContainer = styled(TouchableLink).attrs(
  ({ theme, accessibilityLabel, selected }) => ({
    accessibilityLabel: theme.tabBar.showLabels ? undefined : accessibilityLabel,
    hoverUnderlineColor: selected ? theme.colors.black : theme.colors.greyDark,
  })
)(({ theme }) => ({
  alignItems: 'center',
  height: theme.tabBar.height,
  flex: 1,
}))

const Title = styled(Typo.Caption)<{ selected?: boolean }>(({ theme, selected }) => ({
  display: theme.tabBar.showLabels ? undefined : 'none',
  color: selected ? theme.colors.black : theme.colors.greyDark,
  fontSize: theme.tabBar.fontSize,
  textAlign: 'center',
}))
